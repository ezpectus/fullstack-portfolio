# Changelog

## [2.2.1] — 2025-08-12

### Bug Fixes

- **`delete_schedule` leaked all users' schedules** — The endpoint had no `owner_id` filter, so any authenticated user could delete any schedule. Fixed: join with `ProjectModel` and filter by `owner_id`, including unprojected schedules.

- **`toggle_schedule` leaked all users' schedules** — Same security issue as `delete_schedule`. No `owner_id` filter; any authenticated user could toggle any schedule. Fixed: join with `ProjectModel` and filter by `owner_id`, including unprojected schedules.

- **`delete_channel` leaked all users' notification channels** — Same security issue. Fixed: join with `ProjectModel` and filter by `owner_id`, including unprojected channels.

## [2.2.0] — 2025-08-12

### Bug Fixes

- **CRITICAL: `_run_workflow_task` created new DI container per worker** —
  `cli/app.py` called `create_container()` inside the task function,
  spawning a new browser engine and logger for every worker. Container
  is now passed through from the CLI command.

- **Proxy rotation didn't actually rotate** — `ProxyPoolManager.rotate()`
  called `release()` which already popped the proxy from `_assigned`,
  then tried to pop again (got `None`). With `rotation_enabled=False`
  (default), `assign()` gave back the same proxy. Fixed: pop directly
  from `_assigned`, append to `_available`, then assign.

- **Race condition on `headless` setting** — `server.py` mutated
  `container.settings.browser.headless` on a shared singleton container.
  Concurrent API calls would overwrite each other's setting before the
  background task read it. Removed the mutation; headless is now
  controlled via `.env` configuration only.

- **Deprecated `asyncio.get_event_loop().time()`** — `runner.py` used
  the deprecated API. Replaced with `time.monotonic()`.

- **Fragile path construction** — `container.py` used
  `f"{dir}/../states"` string concatenation. Replaced with
  `Path(dir).parent / "states"`.

- **Missing `python-multipart` dependency** — `OAuth2PasswordRequestForm`
  in auth routes requires `python-multipart`, but it was missing from
  both `requirements.txt` and `pyproject.toml`. Added.

- **Stale version in `pyproject.toml`** — Version was still `1.0.0`
  despite web dashboard release. Updated to `2.2.0`.

- **Dict mutation during iteration in `pool.py`** — `initialize()`
  iterated `self._workers.items()` via `zip()` while deleting failed
  workers from the same dict. This can raise `RuntimeError: dictionary
  changed size during iteration`. Fixed: snapshot keys with `list()`
  before iterating.

- **Race condition in `RateLimiter._domain_locks`** — Two coroutines
  could simultaneously check `if domain not in self._domain_locks` and
  create separate `asyncio.Lock` objects for the same domain, bypassing
  mutual exclusion. Fixed: use `dict.setdefault()` for atomic creation.

- **Page leak in `Worker.execute()`** — Browser pages created via
  `self._session.new_page()` were never closed after task completion
  or failure, leaking resources. Fixed: close page on both success
  and error paths.

- **Incorrect cron baseline in `CronScheduler`** — When `next_run_at`
  was `None`, the scheduler computed the next run from `now - 1min`
  instead of `now`. This caused `get_next()` to return a timestamp
  that could be in the past, triggering immediate execution on every
  check loop. Fixed: use `now` as the baseline.

- **Inline imports in service providers** — `fivesim.py`, `sms_activate.py`,
  and `tempmail.py` had `import asyncio`, `import time`, `import re`,
  `import random`, `import string` inside methods. Moved all to module
  top level.

- **Stale version in `server.py`** — FastAPI app version was `"2.0.0"`
  while `pyproject.toml` is `2.2.0`. Updated to match.

- **WebSocket `JSONDecodeError` crash** — `websocket_endpoint` in
  `server.py` only caught `WebSocketDisconnect`. If a client sent
  invalid JSON, `json.loads()` raised `JSONDecodeError`, crashing the
  handler and leaving the socket in `_connected_ws` forever. Fixed:
  broad `except Exception` with `finally` to always remove the socket.

- **Dead `headless` parameter in `api_run`** — The endpoint accepted
  `headless: bool = Query(True)` but never used it (the race condition
  fix removed the mutation). Removed the dead parameter.

- **Global lock held during sleep in `RateLimiter.acquire`** —
  `async with self._global_lock: while ... : await asyncio.sleep(0.1)`
  blocked all other coroutines from acquiring or releasing the global
  slot. Fixed: acquire-check-release loop, sleep outside the lock.

- **`TaskResult.retries` always 0 in scheduler** —
  `TaskScheduler._run_with_retry` retried tasks but never recorded the
  attempt count in the result. `WorkflowStats.total_retries` was always
  0. Fixed: use `dataclasses.replace()` to set `retries=attempt` on
  each result.

- **Double-release in `WorkerPool.release`** — If `release()` was called
  twice for the same worker (e.g. due to exception in `execute` +
  cleanup), the worker ID was appended to `_available` twice, allowing
  the same worker to be acquired by two concurrent tasks. Fixed: early
  return if worker ID not in `_busy`.

- **Inline import in `Worker._take_screenshot`** — `from pathlib import
  Path` was inside the method. Moved to module top-level imports.

- **Inline import in `auth/routes.py`** — `from web.auth.service import
  get_user_by_id` was inside the `api_me` handler. Moved to top-level
  import.

- **Dead `waiters` field in `DomainState`** — `DomainState.waiters`
  was declared but never read or written. Removed. Also removed unused
  `field` import from `dataclasses`.

- **Query filter applied after LIMIT/OFFSET in `list_history`** —
  `repository.py` built `SELECT ... ORDER BY ... LIMIT ... OFFSET ...`
  then chained `.where()` afterward. SQLAlchemy applies clauses in
  construction order, so the filter was applied to the wrong subset.
  Fixed: apply `WHERE` before `LIMIT`/`OFFSET`.

- **Inline imports in `scheduler/routes.py`** — `import croniter` and
  `from datetime import datetime, timezone` were inside the
  `create_schedule` handler. Moved to top-level imports.

- **Inline import in `repository.py`** — `from datetime import datetime,
  timezone` was inside `save_task_record`. Moved to top-level imports.

- **`delete_schedule` silently returned 200 for missing schedule** —
  No existence check; always returned `{"status": "deleted"}`. Fixed:
  404 if schedule not found.

- **`delete_channel` silently returned 200 for missing channel** —
  Same issue as `delete_schedule`. Fixed: 404 if channel not found.

- **Non-deterministic `hash()` in `UserAgentRotator.get_for_worker`** —
  Python's built-in `hash()` is randomized per process via
  `PYTHONHASHSEED`. The method claimed to be "consistent across
  restarts" but returned different profiles each run. Fixed: use
  `hashlib.md5` for stable worker-to-UA mapping.

- **localStorage restore on wrong origin in `ContextStateManager`** —
  `restore_state` called `page.evaluate("localStorage.setItem(...)")`
  on existing context pages, which may be on `about:blank` or a
  different domain. localStorage is origin-scoped, so the data never
  applied to the target site. Fixed: create a temp page, navigate to
  the origin URL, set items, then close the page.

- **Inline import in `GeolocationManager.get_random_location`** —
  `import random` was inside the method. Moved to top-level imports.

- **`window.mouseX`/`window.mouseY` don't exist in browsers** —
  `HumanInteractionEngine._move_mouse_to` read `window.mouseX` and
  `window.mouseY` to get the current mouse position. These are not
  standard browser properties and always return `undefined`, so mouse
  movement always started from (0,0) — the top-left corner. Fixed:
  track last mouse position internally in the engine instance.

- **`NotificationSender.notify` with `project_id=None` matched nothing** —
  `if project_id:` was falsy for `None`, so the query had no
  `project_id` filter and returned all channels. But `if project_id:`
  also skips `project_id=0` (unlikely but incorrect). The real bug:
  when changed to `if project_id is not None`, `WHERE project_id =
  NULL` in SQL never matches any row (NULL != NULL). Fixed: use
  `.is_(None)` for NULL comparison.

- **`compute_stats` counted cancelled tasks as failed** —
  `failed = sum(1 for r in results if not r.is_success)` included
  `CANCELLED` tasks since `is_success` is `False` for them. But
  `cancelled` was also counted separately, causing double-counting.
  Fixed: exclude `CANCELLED` from `failed` count.

- **Screenshot page leak in `Worker.execute()` exception handler** —
  When a task failed and `screenshot_on_fail` was true, a new page was
  created via `self._session.new_page()` for the screenshot but never
  closed, leaking a browser page on every failure. Fixed: close the
  screenshot page in a `finally` block.

- **Auto-created httpx client never closed in `BaseAPIService._request`** —
  If `_request` was called without entering the async context manager,
  a new `httpx.AsyncClient` was created but never closed, leaking
  socket connections. Fixed: track auto-creation and close in `finally`.

- **Empty `api_key` sent as `Authorization: Bearer ` header** —
  `BaseAPIService._request` always set `Authorization: Bearer
  {self._api_key}` even when `api_key` was empty (e.g. TempMailService).
  This sent a malformed `Bearer ` header to APIs that don't use it.
  Fixed: only set `Authorization` header when `api_key` is non-empty.

- **`psutil.cpu_percent(interval=0.1)` blocked async event loop** —
  `ResourceMonitor._collect` called `cpu_percent(interval=0.1)` which
  does a blocking 100ms sleep to measure CPU usage. This blocked all
  coroutines for 100ms on every monitoring cycle. Fixed: use
  `interval=None` for non-blocking measurement (returns CPU since
  last call).

- **Server shutdown didn't stop container resources** — `_shutdown`
  handler stopped the cron scheduler and closed the DB, but never
  stopped `container.resource_monitor` or `container.browser_engine`,
  leaking a Playwright browser process and a background monitoring
  task on shutdown. Fixed: stop both in the shutdown handler.

- **Proxy health check ignored proxy credentials** —
  `ProxyPoolManager.check_health` created `httpx.AsyncClient(proxy=
  proxy.server)` without passing username/password. Authenticated
  proxies always failed health check with auth errors. Fixed: pass
  `proxy_auth` tuple when credentials are present.

- **CRITICAL: Scheduler executed tasks sequentially, using only 1
  worker** — `TaskScheduler._loop` awaited `_run_with_retry` directly
  in the loop, blocking until each task completed. With N workers in
  the pool, only 1 was utilized at any time. Fixed: dispatch tasks
  concurrently via `asyncio.create_task`, track running tasks in a
  set.

- **`wait_all` returned before last task completed** — `wait_all`
  only checked if queues were empty, but a dequeued task could still
  be executing in `_run_with_retry`. The caller read incomplete
  results. Fixed: also wait for `_running_tasks` to drain.

- **No backoff between retry attempts in scheduler** —
  `_run_with_retry` immediately retried on failure with no delay,
  hammering the target on transient errors. Fixed: exponential
  backoff (1s, 2s, 4s, ... capped at 30s) between attempts.

- **`stop()` didn't wait for running tasks** — `TaskScheduler.stop`
  cancelled the loop task but didn't await in-flight task executions,
  potentially orphaning browser pages. Fixed: `gather` running tasks
  with `return_exceptions=True` before clearing.

- **Race condition in `RateLimiter.release`** — `release` modified
  `state.request_count` without holding the domain lock, while
  `acquire` reads and writes it under the lock. A concurrent `release`
  during `acquire`'s `while state.request_count >= max` check could
  cause `acquire` to see a stale count and never proceed. Fixed:
  `release` now acquires the domain lock before decrementing.

- **`scale_up` produced duplicate worker IDs after `scale_down`** —
  `scale_up` used `f"worker_{len(self._workers) + i}"` for new IDs.
  After removing workers via `scale_down`, `len(self._workers)` could
  produce an ID that already existed, causing a `KeyError` on acquire.
  Fixed: use a monotonically incrementing `_next_worker_id` counter.

- **Page leak in `ContextIsolationProvider.validate_isolation`** —
  Pages created for localStorage testing were closed with a bare
  `await page.close()` after the evaluate call. If `evaluate` or
  `add_cookies` threw, the page was never closed. Fixed: wrap in
  `try/finally` to always close the page.

- **`delete_project` used raw SQL delete, bypassing ORM cascade** —
  `repository.py` used `delete(ProjectModel).where(...)` which
  executes a SQL DELETE, bypassing the ORM `cascade="all,
  delete-orphan"` on the relationship. Related task records and
  schedules were orphaned instead of deleted (SQLite has
  `PRAGMA foreign_keys = OFF` by default). Fixed: use `db.delete()`
  on the loaded ORM object to trigger cascade.

- **`list_history` leaked all users' task records** — The endpoint
  had no `owner_id` filter, so any authenticated user could see
  every task record in the database. Fixed: join with `ProjectModel`
  and filter by `owner_id`, including unprojected records
  (`project_id IS NULL`).

- **Inline import in `test_runner.py`** — `from datetime import
  timedelta` was inside `_make_result`. Moved to top-level imports.

- **`Task.create` passed tuple items as single arg in CLI workflow
  command** — `cli/app.py` passed `[(workflow_type, url, data)]` as
  items to `run_workflow`, which builds `Task.create(_task, item)`.
  The `_task` function expected 3 separate args (`wf_type,
  target_url, wf_data`) but received a single tuple, causing
  `TypeError` at runtime. Fixed: `_task` now accepts a single `item`
  arg and unpacks it internally.

- **`SMSActivateService` sent duplicate `api_key` via header and
  query params** — sms-activate.org uses `api_key` as a query
  parameter, not Bearer auth. After the `BaseAPIService` fix that
  sends `Authorization: Bearer {api_key}` when `api_key` is non-empty,
  `SMSActivateService` now sends the key both as a header and in
  params. The spurious `Authorization` header may cause API rejection.
  Fixed: pass `api_key=""` to `BaseAPIService` (suppresses header),
  store the real key in `_sms_api_key` for query params.

- **`list_schedules` leaked all users' schedules** — Same security
  issue as `list_history`. No `owner_id` filter; any authenticated
  user could see every schedule. Fixed: join with `ProjectModel`
  and filter by `owner_id`, including unprojected schedules.

- **`list_channels` leaked all users' notification channels** — Same
  security issue. Fixed: join with `ProjectModel` and filter by
  `owner_id`, including unprojected channels.

- **`delete_schedule` used raw SQL delete, bypassing ORM** — Same
  pattern as `delete_project`. `delete(ScheduleModel).where(...)`
  executes a SQL DELETE, bypassing ORM session management. Fixed:
  use `db.delete()` on the loaded ORM object.

- **`delete_channel` used raw SQL delete, bypassing ORM** — Same
  pattern. Fixed: use `db.delete()` on the loaded ORM object.

- **Page leak in `Worker.navigate()`** — `navigate` created a page
  via `self._session.new_page()` and closed it only on the success
  path. If `interaction_engine.navigate` threw, the `except` block
  didn't close the page, leaking a browser page per failed
  navigation. Fixed: use `try/finally` to always close the page.

- **Page leak in `PlaywrightBrowserSession.validate()`** — `validate`
  created a page via `self._context.new_page()` and closed it only
  after successful `evaluate`. If `goto` or `evaluate` threw, the
  page was never closed. Fixed: use `try/finally` to always close.

- **Dead code in `CronScheduler._check_and_run`** — The `elif not
  sched.next_run_at` branch computed `croniter.get_next(datetime)`
  from `now`, which always returns a future timestamp, so
  `next_dt <= now` was always `False`. The branch never executed.
  Removed the dead code; schedules always have `next_run_at` set at
  creation time.

- **`history_stats` leaked all users' task statistics** — Same
  security issue as `list_history`. No `owner_id` filter; any
  authenticated user could see global task counts, success rate,
  and average duration across all users. Fixed: add `outerjoin`
  with `ProjectModel` and filter by `owner_id` on all four
  aggregate queries.

- **`NotificationChannelModel` missing ORM relationship to
  `ProjectModel`** — Unlike `TaskRecordModel` and `ScheduleModel`,
  `NotificationChannelModel` had no `relationship()` to
  `ProjectModel`, and `ProjectModel` had no `cascade="all,
  delete-orphan"` for it. When a project was deleted via
  `db.delete()`, its notification channels were orphaned (SQLite
  has `PRAGMA foreign_keys = OFF` by default). Fixed: add
  `relationship` on both models with `cascade="all, delete-orphan"`.

- **Deadlock in `RateLimiter.acquire` — domain lock held during
  sleep** — `acquire` held the domain lock during
  `asyncio.sleep(0.1)` while polling `request_count <
  max_per_domain`. `release` also needs the domain lock. If a 4th
  worker was waiting for a slot (holding the lock and sleeping), no
  worker could call `release` for the same domain → deadlock.
  Fixed: release the domain lock during the polling sleep, and
  sleep for min_delay after successfully acquiring the slot (outside
  the lock).

- **`proxy_auth` not a valid httpx parameter in
  `ProxyPoolManager.check_health`** — httpx `AsyncClient` has no
  `proxy_auth` parameter; proxy credentials must be embedded in the
  proxy URL. The previous fix passed `proxy_auth=(user, pass)` which
  was silently ignored, so health checks for authenticated proxies
  always failed. Fixed: embed credentials in the proxy URL as
  `scheme://user:pass@host:port`.

- **`CronScheduler._check_and_run` timezone mismatch —
  `TypeError`** — `now = datetime.now(timezone.utc)` (aware)
  compared with `sched.next_run_at` loaded from SQLite (naive —
  SQLite strips timezone info). This raised `TypeError: can't
  compare offset-naive and offset-aware datetimes` on every cron
  check, silently breaking the entire scheduler loop. Fixed: use
  `datetime.now(timezone.utc).replace(tzinfo=None)` for comparison.

- **`create_schedule`, `create_channel`, and `api_run` accepted
  arbitrary `project_id` without ownership validation** — Any
  authenticated user could create schedules, notification channels,
  or save task records to another user's project by passing that
  project's ID. Fixed: validate `project_id` ownership via
  `ProjectModel.owner_id == user["user_id"]` before creating
  associated records in all three endpoints.

- **`BaseAPIService._request` crashed on non-JSON API responses** —
  `resp.json()` was called unconditionally on every API response.
  SMS-Activate returns plain text (e.g. `ACCESS_BALANCE:123`,
  `ACCESS_NUMBER:id:phone`), which is not valid JSON.
  `json.JSONDecodeError` is not a subclass of `httpx.HTTPError`, so
  it propagated unhandled, breaking all SMS-Activate API calls.
  Fixed: try `resp.json()`, fall back to `resp.text` on parse
  failure.

- **`CronScheduler` never started in web server** —
  `_cron_scheduler` was declared as `None` and never instantiated
  or started in `_startup`. Schedules created via the API were
  stored in the database but never executed — the cron loop never
  ran. Fixed: create `CronScheduler` with a task runner in
  `_startup` and call `start()`.

## [2.1.0] — 2025-08-12

### Bug Fixes

- **CRITICAL: DB session closed before background task completion** —
  `api_run` endpoint used FastAPI-managed `db` session inside
  `asyncio.create_task()`, which outlived the request. Background task
  now creates its own session via `_session_factory()`.

- **Hardcoded JWT secret** — `SECRET_KEY` was a string literal.
  Now reads from `WEB_JWT_SECRET` env var with fallback default.

- **Hardcoded JWT expiry** — `TOKEN_EXPIRE_HOURS` was hardcoded to 24.
  Now reads from `WEB_JWT_EXPIRE_HOURS` env var.

- **Hardcoded DB path** — `init_db()` always used `"data/executor.db"`.
  Now reads from `WEB_DB_PATH` env var.

- **Telegram `chat_id: None`** — Telegram API payload included
  `"chat_id": None` which is invalid. Removed `chat_id` field;
  webhook URL receives plain text payload.

- **HTML tags in Discord notifications** — Message used `<b>` tags
  with `parse_mode: HTML`. Discord doesn't support HTML. Switched
  to plain text, removed `parse_mode`.

- **webhook_url exposed in API response** — `ChannelResponse` returned
  the full webhook URL. Removed from response model for security.

- **No ownership check on project deletion** — Any authenticated user
  could delete any project. Added `owner_id` check in `delete_project`.

- **Dead code in scheduler routes** — `CronScheduler.__new__()` call
  in `create_schedule` was nonsensical. Removed.

### Removed

- `from __future__ import annotations` from all 41 Python files.
  Python 3.11+ supports `X | Y` syntax natively; the import was
  unnecessary boilerplate.

- Google-style docstrings (`Args:` / `Returns:` / `Raises:` sections)
  from ~20 files. Replaced with concise one-line docstrings.

- Unused imports across 8 files: `FileResponse`, `TaskResult`,
  `TaskStatus`, `sessionmaker`, `get_session`, `CronScheduler`,
  `Any`, `Annotated`, `HTTPException`, `Depends`, `AsyncSession`.

### Documentation

- Moved `ARCHITECTURE.md` from project root to `docs/ARCHITECTURE.md`.
- Moved `INTEGRATION_PLAN.md` from project root to `docs/INTEGRATION_PLAN.md`.
- Created `docs/CHANGELOG.md` (this file).
- Removed `docs/PLAN.md` and `docs/PHASE_*.md` — development plan
  files that were no longer relevant.
- Updated `README.md` links to point to new `docs/` locations.

### Configuration

- `.env.example` already includes `WEB_JWT_SECRET`, `WEB_DB_PATH`,
  `WEB_JWT_EXPIRE_HOURS` (added in previous session).

## [2.0.0] — Initial Web Release

### Added

- FastAPI web dashboard with dark-themed UI
- JWT authentication (bcrypt + python-jose)
- SQLite persistence via async SQLAlchemy (aiosqlite)
- Cron-based task scheduler (croniter)
- Telegram and Discord notification webhooks
- WebSocket live updates
- Project and task history CRUD API
- Docker support (Dockerfile + docker-compose)
- Setup scripts (`setup.bat` / `setup.sh`) with verification steps

### Core Framework (from 1.0)

- Playwright Firefox browser engine with proxy support
- Worker pool with sticky proxy assignment and profile isolation
- Priority-based task scheduler with retry and backoff
- Human interaction engine (bezier mouse curves, typing with typos)
- Context isolation validation (localStorage + cookie leak detection)
- SMS/Email service templates (5sim, sms-activate, 1secmail)
- Resource monitoring (CPU, RAM, disk, network)
- Rate limiter (per-domain + global concurrent caps)
- Fingerprint rotation (user-agent, geolocation)
- Graceful shutdown (SIGINT/SIGTERM)
- JSON/CSV export
- Click CLI (run, benchmark, workflow, status, web)

## [1.0.0] — CLI Release

- Initial framework: core, infrastructure, concurrency, app, CLI
- 60-task development plan executed across 13 phases
- 9 test files covering models, config, proxy, validators, retry,
  workflows, fingerprint, runner, integration
