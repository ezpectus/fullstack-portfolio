"""Scheduler CRUD routes."""

from typing import Annotated, Any

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

import croniter
from datetime import datetime, timezone

from web.auth.routes import CurrentUser
from web.db.models import ScheduleModel, ProjectModel
from web.db.session import get_session


router = APIRouter(prefix="/api/schedules", tags=["scheduler"])


class ScheduleCreate(BaseModel):
    name: str
    cron_expr: str
    task_config: dict[str, Any]
    project_id: int | None = None


class ScheduleResponse(BaseModel):
    id: int
    name: str
    cron_expr: str
    task_config: dict[str, Any]
    is_active: bool
    last_run_at: str | None = None
    next_run_at: str | None = None
    run_count: int
    project_id: int | None = None


def _to_response(s: ScheduleModel) -> ScheduleResponse:
    return ScheduleResponse(
        id=s.id,
        name=s.name,
        cron_expr=s.cron_expr,
        task_config=s.task_config,
        is_active=s.is_active,
        last_run_at=s.last_run_at.isoformat() if s.last_run_at else None,
        next_run_at=s.next_run_at.isoformat() if s.next_run_at else None,
        run_count=s.run_count,
        project_id=s.project_id,
    )


@router.get("", response_model=list[ScheduleResponse])
async def list_schedules(
    user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_session)],
):
    result = await db.execute(
        select(ScheduleModel)
        .outerjoin(ProjectModel, ScheduleModel.project_id == ProjectModel.id)
        .where(
            (ProjectModel.owner_id == int(user["user_id"])) |
            (ScheduleModel.project_id.is_(None))
        )
    )
    return [_to_response(s) for s in result.scalars().all()]


@router.post("", response_model=ScheduleResponse)
async def create_schedule(
    req: ScheduleCreate,
    user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_session)],
):
    try:
        if not croniter.croniter.is_valid(req.cron_expr):
            raise HTTPException(400, f"Invalid cron expression: {req.cron_expr}")

        if req.project_id is not None:
            proj = await db.execute(
                select(ProjectModel).where(
                    ProjectModel.id == req.project_id,
                    ProjectModel.owner_id == int(user["user_id"]),
                )
            )
            if not proj.scalar_one_or_none():
                raise HTTPException(404, "Project not found")

        now = datetime.now(timezone.utc).replace(tzinfo=None)
        cron = croniter.croniter(req.cron_expr, now)
        next_dt = cron.get_next(datetime)

        model = ScheduleModel(
            name=req.name,
            cron_expr=req.cron_expr,
            task_config=req.task_config,
            project_id=req.project_id,
            next_run_at=next_dt,
        )
        db.add(model)
        await db.flush()
        return _to_response(model)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(400, str(e))


@router.delete("/{schedule_id}")
async def delete_schedule(
    schedule_id: int,
    user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_session)],
):
    result = await db.execute(
        select(ScheduleModel)
        .outerjoin(ProjectModel, ScheduleModel.project_id == ProjectModel.id)
        .where(
            ScheduleModel.id == schedule_id,
            (ProjectModel.owner_id == int(user["user_id"])) | (ScheduleModel.project_id.is_(None))
        )
    )
    sched = result.scalar_one_or_none()
    if not sched:
        raise HTTPException(404, "Schedule not found")
    await db.delete(sched)
    return {"status": "deleted"}


@router.post("/{schedule_id}/toggle")
async def toggle_schedule(
    schedule_id: int,
    user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_session)],
):
    result = await db.execute(
        select(ScheduleModel)
        .outerjoin(ProjectModel, ScheduleModel.project_id == ProjectModel.id)
        .where(
            ScheduleModel.id == schedule_id,
            (ProjectModel.owner_id == int(user["user_id"])) | (ScheduleModel.project_id.is_(None))
        )
    )
    sched = result.scalar_one_or_none()
    if not sched:
        raise HTTPException(404, "Schedule not found")
    sched.is_active = not sched.is_active
    await db.flush()
    return {"id": sched.id, "is_active": sched.is_active}
