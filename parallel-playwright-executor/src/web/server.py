"""Web dashboard server — FastAPI with auth, persistence, scheduler, notifications."""

import asyncio
import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import uvicorn

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Query, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy import select

from app.container import create_container
from app.runner import run_workflow
from web.auth.routes import router as auth_router, CurrentUser
from web.db.session import init_db, create_tables, close_db, _session_factory
from web.db.repository import router as history_router, save_task_record
from web.db.models import ProjectModel
from web.notifications.routes import router as notif_router
from web.notifications.service import NotificationSender
from web.scheduler.routes import router as sched_router
from web.scheduler.service import CronScheduler

app = FastAPI(title="Playwright Executor Dashboard", version="2.2.0")

_static_dir = Path(__file__).parent / "static"
_templates_dir = Path(__file__).parent / "templates"
app.mount("/static", StaticFiles(directory=str(_static_dir)), name="static")

# Register routers
app.include_router(auth_router)
app.include_router(history_router)
app.include_router(notif_router)
app.include_router(sched_router)

_container = None
_notifier = NotificationSender()
_cron_scheduler: CronScheduler | None = None
_connected_ws: list[WebSocket] = []
_bg_tasks: set[asyncio.Task[None]] = set()


def _get_container():
    global _container
    if _container is None:
        _container = create_container()
    return _container


async def _cron_task_runner(task_config: dict[str, Any]) -> dict[str, Any]:
    async def _task(page, url):
        await page.goto(url, timeout=30000)
        title = await page.title()
        return {"url": url, "title": title}

    container = _get_container()
    urls = task_config.get("urls", [])
    workers = task_config.get("workers", 4)
    project_id = task_config.get("project_id")
    result = await run_workflow(container, _task, urls, worker_count=workers, install_signals=False)
    if _session_factory is not None:
        async with _session_factory() as bg_db:
            for tid, r in result["results"].items():
                status = r["status"]
                started = datetime.fromisoformat(r["started_at"]) if r.get("started_at") else None
                completed = datetime.fromisoformat(r["completed_at"]) if r.get("completed_at") else None
                await save_task_record(
                    bg_db,
                    task_id=tid,
                    status=status,
                    result={"url": r.get("result", {}).get("url", ""), "title": r.get("result", {}).get("title", "")} if r.get("result") else None,
                    error=r.get("error"),
                    retries=r.get("retries", 0),
                    duration_s=r.get("duration_s"),
                    screenshot_path=r.get("screenshot"),
                    project_id=project_id,
                    started_at=started,
                    completed_at=completed,
                )
            await bg_db.commit()
    return result


@app.on_event("startup")
async def _startup():
    global _cron_scheduler
    init_db()
    await create_tables()
    container = _get_container()
    await container.resource_monitor.start(interval_s=2.0)
    _cron_scheduler = CronScheduler(_cron_task_runner, logger=container.logger)
    await _cron_scheduler.start()


@app.on_event("shutdown")
async def _shutdown():
    if _cron_scheduler:
        await _cron_scheduler.stop()
    if _bg_tasks:
        try:
            await asyncio.wait_for(
                asyncio.gather(*_bg_tasks, return_exceptions=True),
                timeout=30.0,
            )
        except asyncio.TimeoutError:
            for t in _bg_tasks:
                t.cancel()
            await asyncio.gather(*_bg_tasks, return_exceptions=True)
        _bg_tasks.clear()
    if _container:
        await _container.resource_monitor.stop()
        await _container.browser_engine.stop()
    await close_db()


@app.get("/", response_class=HTMLResponse)
async def index():
    template = _templates_dir / "index.html"
    return template.read_text(encoding="utf-8")


@app.get("/api/status")
async def api_status(user: CurrentUser):
    container = _get_container()
    monitor = container.resource_monitor
    metrics = monitor.get_current()
    if metrics:
        return {
            "cpu_percent": metrics.cpu_percent,
            "ram_percent": metrics.ram_percent,
            "ram_available_gb": metrics.ram_available_gb,
            "disk_percent": metrics.disk_percent,
            "network_sent_mb": metrics.network_sent_mb,
            "network_recv_mb": metrics.network_recv_mb,
            "timestamp": metrics.timestamp.isoformat(),
        }
    return {"error": "Monitor not started"}


@app.get("/api/config")
async def api_config(user: CurrentUser):
    container = _get_container()
    s = container.settings
    return {
        "browser": {"type": s.browser.type, "headless": s.browser.headless, "timeout_ms": s.browser.timeout_ms},
        "worker": {"default_count": s.worker.default_count, "max_count": s.worker.max_count},
        "proxy": {"enabled": s.proxy.enabled, "rotation": s.proxy.rotation_enabled},
        "rate_limit": {"enabled": s.rate_limit.enabled, "min_delay_s": s.rate_limit.min_delay_s},
        "fingerprint": {"ua_rotation": s.fingerprint.ua_rotation, "geolocation": s.fingerprint.geolocation_spoofing},
    }


@app.post("/api/run")
async def api_run(
    urls: list[str],
    user: CurrentUser,
    workers: int = Query(4, ge=1, le=64),
    project_id: int | None = Query(None),
):
    async def _task(page, url):
        await page.goto(url, timeout=30000)
        title = await page.title()
        return {"url": url, "title": title}

    container = _get_container()

    if project_id is not None:
        async with _session_factory() as check_db:
            proj = await check_db.execute(
                select(ProjectModel).where(
                    ProjectModel.id == project_id,
                    ProjectModel.owner_id == int(user["user_id"]),
                )
            )
            if not proj.scalar_one_or_none():
                raise HTTPException(404, "Project not found")

    async def _run():
        result = await run_workflow(container, _task, urls, worker_count=workers, install_signals=False)
        if _session_factory is None:
            return
        async with _session_factory() as bg_db:
            for tid, r in result["results"].items():
                status = r["status"]
                started = datetime.fromisoformat(r["started_at"]) if r.get("started_at") else None
                completed = datetime.fromisoformat(r["completed_at"]) if r.get("completed_at") else None
                await save_task_record(
                    bg_db,
                    task_id=tid,
                    status=status,
                    result={"url": r.get("result", {}).get("url", ""), "title": r.get("result", {}).get("title", "")} if r.get("result") else None,
                    error=r.get("error"),
                    retries=r.get("retries", 0),
                    duration_s=r.get("duration_s"),
                    screenshot_path=r.get("screenshot"),
                    project_id=project_id,
                    started_at=started,
                    completed_at=completed,
                )
                if status == "failed":
                    await _notifier.notify(bg_db, "task_failed", tid, status, r.get("error"), project_id)
                elif status == "completed":
                    await _notifier.notify(bg_db, "task_completed", tid, status, None, project_id)
            await bg_db.commit()
        await _broadcast_update()

    t = asyncio.create_task(_run())
    _bg_tasks.add(t)
    t.add_done_callback(_bg_tasks.discard)
    return {"status": "started", "urls": urls, "workers": workers, "project_id": project_id}


@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    await ws.accept()
    _connected_ws.append(ws)
    try:
        while True:
            data = await ws.receive_text()
            msg = json.loads(data)
            if msg.get("type") == "ping":
                await ws.send_json({"type": "pong"})
    except WebSocketDisconnect:
        pass
    except Exception:
        pass
    finally:
        if ws in _connected_ws:
            _connected_ws.remove(ws)


async def _broadcast_update():
    for ws in _connected_ws[:]:
        try:
            await ws.send_json({"type": "update", "timestamp": datetime.now(timezone.utc).isoformat()})
        except Exception:
            if ws in _connected_ws:
                _connected_ws.remove(ws)


def start_server(host: str = "0.0.0.0", port: int = 8080):
    uvicorn.run(app, host=host, port=port, log_level="info")
