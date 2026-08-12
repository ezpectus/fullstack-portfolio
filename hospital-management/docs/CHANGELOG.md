# Changelog

## [1.0.1] — Unreleased

### Fixed
- **BUG-HOS-BE-024:** Added missing eslint and prettier to devDependencies for code quality tools (`package.json`)
- **BUG-HOS-FE-003:** Added missing .eslintrc.json and .prettierrc for code quality consistency (`frontend/.eslintrc.json`, `frontend/.prettierrc`)
- **BUG-HOS-BE-022:** Added missing .eslintrc.json and .prettierrc for code quality consistency (`backend/.eslintrc.json`, `backend/.prettierrc`)
- **BUG-HOS-BE-023:** Added missing Dockerfile.dev for development Docker builds (`backend/Dockerfile.dev`)
- **BUG-HOS-FE-001:** Added missing vitest.config.ts for frontend testing (`frontend/vitest.config.ts`)
- **BUG-HOS-FE-002:** Added missing Dockerfile.dev for frontend development (`frontend/Dockerfile.dev`)
- **BUG-HOS-BE-021:** Fixed .env path in env.ts from '../../.env' to '.env' for correct environment variable loading (`config/env.ts`)
- **BUG-HOS-DEP-001:** Added missing Dockerfile.backend for production Docker builds (`Dockerfile.backend`)

### Security

- **BUG-HOS-BE-001**: JWT secrets now use `required()` without fallback — prevents running with insecure default secrets (`config/env.ts`)
- **BUG-HOS-BE-003**: `DATABASE_URL` now uses `required()` without empty-string fallback (`config/env.ts`)
- **BUG-HOS-BE-007**: Refresh tokens use `crypto.randomBytes(40)` instead of `jwt.sign` — opaque tokens prevent information leakage (`auth.service.ts`)
- **BUG-HOS-BE-010**: `refresh()` now checks `revokedAt` field before issuing new tokens — prevents reuse of revoked tokens (`auth.service.ts`)
- **BUG-HOS-BE-015**: Cookies now include `secure` flag in production (`auth.routes.ts`)
- **BUG-HOS-BE-017**: `authRateLimiter` added to `/refresh` route to prevent brute-force attacks (`auth.routes.ts`)
- **BUG-HOS-BE-018**: `authenticate` middleware added to `/logout` route (`auth.routes.ts`)
- **BUG-HOS-BE-019**: `role` removed from register input — prevents privilege escalation (`auth.service.ts`, `auth.dto.ts`)
- **BUG-HOS-BE-004**: `auth.ts` middleware uses `next(new UnauthorizedError())` instead of `res.status().json()` (`middleware/auth.ts`)
- **BUG-HOS-BE-005**: `rbac.ts` middleware uses `next(new ForbiddenError())` instead of `res.status().json()` (`middleware/rbac.ts`)

### Fixed

- **BUG-HOS-BE-002**: Added `dotenv.config()` with monorepo path resolution (`config/env.ts`)
- **BUG-HOS-BE-006**: Auth errors now use `AppError` subclasses from `shared/errors` instead of `errorHandler` (`auth.service.ts`)
- **BUG-HOS-BE-008**: `generateTokens` is now `private` — prevents external token generation (`auth.service.ts`)
- **BUG-HOS-BE-009**: Removed all `any` types — replaced with proper Prisma and interface types (`auth.service.ts`, `middleware/auth.ts`)
- **BUG-HOS-BE-011**: `refresh()` uses `stored.userId` from DB instead of `jwt.verify` on the refresh token (`auth.service.ts`)
- **BUG-HOS-BE-012**: `logout()` checks token existence before revoking (`auth.service.ts`)
- **BUG-HOS-BE-013**: `login()` returns 401 (Unauthorized) instead of 403 (Forbidden) for inactive accounts (`auth.service.ts`)
- **BUG-HOS-BE-016**: `shared/errors.ts` — all error classes now extend `AppError` base class with `Object.setPrototypeOf` for proper prototype chain (`shared/errors.ts`)
- **BUG-HOS-BE-014**: `authenticate` middleware on `/me` route confirmed present (`auth.routes.ts`)

### Added

- **BUG-HOS-BE-020**: New `/auth/invite` endpoint for admin-only user creation with role assignment (`auth.routes.ts`, `auth.service.ts`, `auth.dto.ts`)
- `revokedAt` field added to `RefreshToken` Prisma model for token revocation tracking (`prisma/schema.prisma`)
- `inviteSchema` with role validation added to `auth.dto.ts`
- Password complexity requirements (min 8 chars, letters + numbers) added to `registerSchema`
- Environment helper functions: `required()`, `optional()`, `optionalInt()`, `parseDuration()` (`config/env.ts`)
- `isProduction` / `isDevelopment` flags and `JWT_REFRESH_EXPIRES_IN_MS` added to env config

### Changed

- `auth.repository.ts`: `deleteRefreshToken` replaced with `revokeRefreshToken` method using `revokedAt` field
- `auth.service.ts`: `sanitizeUser` now returns typed `SanitizedUser` interface instead of spreading `any`
- `auth.service.ts`: `generateTokens` now handles refresh token persistence internally

## [1.0.0] — 2024-01-01

### Added

- **Auth module**: JWT-based authentication with access/refresh tokens, register, login, logout, me endpoints
- **Users module**: CRUD operations for user management with role-based access
- **Departments module**: Hospital department management with head doctor assignment
- **Doctors module**: Doctor profiles with specialization, department, consultation fees, bio
- **Patients module**: Patient profiles with medical info (blood type, allergies, chronic conditions, insurance)
- **Schedule module**: Working hours management, time off, doctor services with pricing
- **Appointments module**: Appointment booking with status workflow (scheduled → in-progress → completed/cancelled/no-show)
- **Medical Records module**: Medical record creation with complaints, examination, diagnosis, prescriptions, epicrisis
- **Notifications module**: In-app notifications with read/unread status, appointment-linked notifications
- **Dashboard module**: Overview stats (appointments today/week, patients, doctors, departments, no-show rate, top specializations, doctor load)
- **Reports module**: Appointment, patient, doctor, and revenue reports with date filtering
- **Prisma schema**: 11 models with relationships, enums for roles, statuses, blood types
- **Seed data**: Demo accounts for all 4 roles (admin, doctor, receptionist, patient), departments, working hours, services, sample appointment
- **Docker setup**: Multi-stage Dockerfiles for backend and frontend, docker-compose for dev and prod
- **CI/CD**: GitHub Actions workflow for backend and frontend testing
- **Swagger**: API documentation at /api/docs
- **Vitest**: Unit tests for DTOs and shared utilities
- **Frontend**: React + Vite + TailwindCSS with Framer Motion animations, Recharts dashboard, role-based routing
