# Changelog — HR Portal

## [1.0.1] — Unreleased

### Fixed
- **BUG-HR-FE-004:** Added missing jsdom to frontend devDependencies for testing (`frontend/package.json`)
- **BUG-HR-BE-012:** Added missing eslint and prettier to devDependencies for code quality tools (`package.json`)
- **BUG-HR-FE-003:** Added missing .eslintrc.json and .prettierrc for code quality consistency (`frontend/.eslintrc.json`, `frontend/.prettierrc`)
- **BUG-HR-BE-010:** Added missing .eslintrc.json and .prettierrc for code quality consistency (`backend/.eslintrc.json`, `backend/.prettierrc`)
- **BUG-HR-BE-011:** Added missing Dockerfile.dev for development Docker builds (`backend/Dockerfile.dev`)
- **BUG-HR-FE-001:** Added missing vitest.config.ts for frontend testing (`frontend/vitest.config.ts`)
- **BUG-HR-FE-002:** Added missing Dockerfile.dev for frontend development (`frontend/Dockerfile.dev`)
- **BUG-HR-BE-009:** Fixed .env path in env.ts from '../../.env' to '.env' for correct environment variable loading (`config/env.ts`)
- **BUG-HR-DEP-001:** Added missing Dockerfile.backend for production Docker builds (`Dockerfile.backend`)

### Security

- **BUG-HR-BE-001**: `authenticate` middleware added to `/logout` route (`auth.routes.ts`)
- **BUG-HR-BE-002**: `authRateLimiter` added to `/logout` route (`auth.routes.ts`)
- **BUG-HR-BE-008**: `authorize` renamed to `requireRole` for naming consistency with other projects; backward-compatible alias exported (`middleware/rbac.ts`, `auth.routes.ts`)
- **BUG-HR-BE-013**: Removed insecure fallback values from `DATABASE_URL` and `REDIS_URL` — now use `required()` without fallback to prevent running with default credentials (`config/env.ts`)
- **BUG-HR-BE-014**: Health endpoint `/api/health` already protected by rate limiter middleware — confirmed no DoS vulnerability (`app.ts`)
- **BUG-HR-BE-015**: Query parameter validation bypass in departments list — used `req.query as Record<string, string>` instead of validated schema. Fixed to use `listDepartmentsSchema.parse(req.query)` (`departments.routes.ts`)
- **BUG-HR-BE-016**: Query parameter validation bypass in documents list — used `req.query as Record<string, string>` instead of validated schema. Fixed to use `listDocumentsSchema.parse(req.query)` (`documents.routes.ts`)
- **BUG-HR-BE-017**: Query parameter validation bypass in employees list — used `req.query as Record<string, string>` instead of validated schema. Fixed to use `listEmployeesSchema.parse(req.query)` (`employees.routes.ts`)
- **BUG-HR-BE-018**: Query parameter validation bypass in leave list and balance — used `req.query as Record<string, string>` and manual `parseInt`. Fixed to use `listLeaveSchema.parse(req.query)` and added `yearSchema` with Zod coercion (`leave.routes.ts`)
- **BUG-HR-BE-019**: Query parameter validation bypass in notifications list — manual parsing without validation. Added `listNotificationsSchema` with proper Zod validation and boolean conversion (`notifications.routes.ts`)
- **BUG-HR-BE-020**: Query parameter validation bypass in payroll list — used `req.query as Record<string, string>` instead of validated schema. Fixed to use `listPayslipSchema.parse(req.query)` (`payroll.routes.ts`)
- **BUG-HR-BE-021**: Query parameter validation bypass in users list — used `req.query as Record<string, string>` instead of validated schema. Fixed to use `listUsersSchema.parse(req.query)` (`users.routes.ts`)
- **BUG-HR-BE-022**: Query parameter validation bypass in reports — manual `parseInt` without validation and unsafe string casting. Added `monthYearSchema`, `yearSchema`, and `exportSchema` with proper Zod validation (`reports.routes.ts`)
- **BUG-HR-BE-023**: Generic Error usage in reports service — used `throw new Error()` instead of custom error class. Replaced with `BadRequestError` for proper error handling (`reports.service.ts`)
- **BUG-HR-BE-024**: Missing rate limiting on invite route — `/invite` endpoint lacked `authRateLimiter`, creating potential DoS vector. Added `authRateLimiter` to prevent abuse (`auth.routes.ts`)
- **BUG-HR-BE-025**: CORS origins used insecure fallback — `CORS_ORIGINS` had default localhost fallback, potentially allowing unintended origins in production. Changed to `required()` to force explicit configuration (`config/env.ts`)
- **BUG-HR-BE-026**: Missing RBAC on departments list route — any authenticated user could list all departments. Added `authorize('HR_ADMIN', 'MANAGER')` to `/departments` route (`departments.routes.ts`)
- **BUG-HR-BE-027**: Missing RBAC on notifications list route — any authenticated user could list all notifications. Added `authorize('HR_ADMIN', 'MANAGER')` to `/notifications` route (`notifications.routes.ts`)

### Fixed

- **BUG-HR-BE-003**: `register()` now returns tokens (accessToken + refreshToken) like `login()` (`auth.service.ts`)
- **BUG-HR-BE-004**: `parseDuration` function added; `JWT_REFRESH_EXPIRES_IN_MS` used for refresh token expiry instead of `parseInt` (`config/env.ts`, `auth.service.ts`)
- **BUG-HR-BE-005**: Environment helper functions (`optional`, `optionalInt`, `parseDuration`) added to `env.ts`; all `parseInt` and `||` patterns replaced with helpers (`config/env.ts`)

### Added

- **BUG-HR-BE-006**: New `/auth/invite` endpoint for HR_ADMIN-only user creation with role assignment (`auth.routes.ts`, `auth.service.ts`, `auth.dto.ts`)
- `inviteSchema` with role validation and password complexity (`auth.dto.ts`)

### Confirmed

- **BUG-HR-BE-007**: Password complexity (min 8 chars, letters + numbers) already present in `registerSchema` (`auth.dto.ts`)

## [1.0.0] — 2026-01-01

### Added

- **Auth**: JWT authentication (register, login, refresh, logout, me) with RBAC (HR_ADMIN, MANAGER, EMPLOYEE)
- **Users**: CRUD with profile management
- **Employees**: CRUD, org structure tree, profiles (education, experience, skills), position/department history, status tracking
- **Departments**: CRUD with hierarchy, department heads, employee lists
- **Leave Management**: Request/approve/reject workflow, 4 leave types (Annual, Sick, Unpaid, Maternity), balance auto-calculation, team calendar, email notifications
- **Payroll**: Payslips (base, bonus, allowances, deductions, total), period management, draft→approved→paid workflow, PDF generation, salary fund charts
- **Documents**: Upload PDF, generate from templates (orders, certificates), employee-linked, download
- **Notifications**: Email notifications for leave requests/approvals, payslip readiness, document generation
- **Dashboard**: Total/active/on-leave counts, pending leave approvals, monthly salary fund, new hires, birthdays
- **Reports**: Turnover rate, average salary by department, leave usage, CSV export
- **Frontend**: React 18 + Vite 5 + TailwindCSS 3 + Framer Motion + Recharts + Zustand + React Query
- **Animations**: Page transitions, staggered lists, modal scale+fade, button micro-interactions, toast slide-in, skeleton shimmer, scroll reveal, number counters, org tree expand/collapse
- **Docker**: Multi-stage builds, docker-compose (prod + dev), launch scripts
- **CI**: GitHub Actions (type check, lint, test)
- **Docs**: ARCHITECTURE.md (with UX Design), API.md, DATABASE.md, DEPLOYMENT.md, CHANGELOG.md
- **Security**: Helmet, CORS whitelist, rate limiting, bcrypt, JWT, RBAC, Zod validation, file upload validation
