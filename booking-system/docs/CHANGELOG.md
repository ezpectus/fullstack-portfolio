# Changelog — Booking System

## [1.0.1] — Unreleased

### Fixed
- **BUG-BOOK-FE-003:** Added missing eslint, prettier, and jsdom to frontend devDependencies for code quality and testing (`frontend/package.json`)
- **BUG-BOOK-FE-001:** Added missing .eslintrc.json and .prettierrc for code quality consistency (`frontend/.eslintrc.json`, `frontend/.prettierrc`)
- **BUG-BOOK-FE-002:** Added missing Dockerfile.dev for frontend development (`frontend/Dockerfile.dev`)
- **BUG-BOOK-BE-008:** Fixed .env path in env.ts from '../../.env' to '.env' for correct environment variable loading (`config/env.ts`)
- **BUG-BOOK-DEP-001:** Added missing Dockerfile.backend for production Docker builds (`Dockerfile.backend`)

### Security

- **BUG-BOOK-BE-001**: `authenticate` middleware added to `/logout` route (`auth.routes.ts`)
- **BUG-BOOK-BE-002**: `requireRole(ROLES.ADMIN, ROLES.PROVIDER)` added to bookings create route (`bookings.routes.ts`)
- **BUG-BOOK-BE-003**: `bookings.service.create` now accepts `user` parameter and checks PROVIDER ownership (`bookings.service.ts`, `bookings.controller.ts`)
- **BUG-BOOK-BE-005**: `bookings.service.delete` now accepts `user` parameter and checks PROVIDER ownership (`bookings.service.ts`, `bookings.controller.ts`)
- **BUG-BOOK-BE-009**: Missing RBAC in customers routes — create, update, delete had no role checks. Added `requireRole(ROLES.ADMIN, ROLES.PROVIDER)` to create and update, `requireRole(ROLES.ADMIN)` to delete (`customers.routes.ts`)
- **BUG-BOOK-BE-010**: Missing RBAC in schedule block/unblock — any authenticated user could block/unblock slots. Added `requireRole(ROLES.ADMIN, ROLES.PROVIDER)` to both endpoints (`schedule.routes.ts`)
- **BUG-BOOK-BE-011**: Removed insecure fallback values from `DATABASE_URL` and `REDIS_URL` — now use `required()` without fallback to prevent running with default credentials (`config/env.ts`)
- **BUG-BOOK-BE-012**: Missing RBAC in bookings status update — any authenticated user could update booking status. Added `requireRole(ROLES.ADMIN, ROLES.PROVIDER)` to `/status` endpoint (`bookings.routes.ts`)
- **BUG-BOOK-BE-013**: Health endpoint `/api/health` was defined before rate limiter middleware, creating potential DoS vector. Moved endpoint definition after `apiRateLimiter` to ensure rate limiting applies (`app.ts`)
- **BUG-BOOK-BE-014**: Query parameter validation bypass in bookings controller — used `req.query as unknown as RequestQuery` instead of validated schema. Fixed to use `paginationSchema.parse(req.query)` (`bookings.controller.ts`)
- **BUG-BOOK-BE-015**: Query parameter validation bypass in customers controller — used `req.query as unknown as RequestQuery` instead of validated schema. Fixed to use `paginationSchema.parse(req.query)` (`customers.controller.ts`)
- **BUG-BOOK-BE-016**: Query parameter validation bypass in notifications controller — used `req.query as unknown as RequestQuery` instead of validated schema. Fixed to use `paginationSchema.parse(req.query)` (`notifications.controller.ts`)
- **BUG-BOOK-BE-017**: Query parameter validation bypass in providers controller — used `req.query as unknown as RequestQuery` instead of validated schema. Fixed to use `paginationSchema.parse(req.query)` (`providers.controller.ts`)
- **BUG-BOOK-BE-018**: Query parameter validation bypass in services controller — used `req.query as unknown as RequestQuery` instead of validated schema. Fixed to use `paginationSchema.parse(req.query)` (`services.controller.ts`)
- **BUG-BOOK-BE-019**: Query parameter validation bypass in users controller — used `req.query as unknown as RequestQuery` instead of validated schema. Fixed to use `paginationSchema.parse(req.query)` (`users.controller.ts`)
- **BUG-BOOK-BE-020**: Missing RBAC in settings routes — any authenticated user could access settings. Added `requireRole(ROLES.ADMIN)` to all settings routes (`settings.routes.ts`)
- **BUG-BOOK-BE-021**: Missing RBAC in dashboard routes — any authenticated user could access dashboard stats. Added `requireRole(ROLES.ADMIN, ROLES.PROVIDER)` to all dashboard routes (`dashboard.routes.ts`)
- **BUG-BOOK-BE-022**: Query parameter validation bypass in dashboard controller — used `req.query as string` and manual `parseInt` without validation. Added `dateRangeSchema` and `limitSchema` with Zod validation (`dashboard.controller.ts`)
- **BUG-BOOK-BE-023**: Missing body validation on refresh route — `/refresh` endpoint lacked `validateBody` middleware. Added `validateBody(refreshSchema)` to ensure request body is validated (`auth.controller.ts`)
- **BUG-BOOK-BE-024**: Health endpoint `/api/health` was defined before API rate limiter, creating potential DoS vector. Removed duplicate health endpoint definition and ensured rate limiter applies to all `/api` routes (`app.ts`)
- **BUG-BOOK-BE-025**: Missing rate limiting on invite route — `/invite` endpoint lacked `authRateLimiter`, creating potential DoS vector. Added `authRateLimiter` to prevent abuse (`auth.routes.ts`)
- **BUG-BOOK-BE-026**: Missing RBAC on bookings list route — any authenticated user could list all bookings. Added `requireRole(ROLES.ADMIN, ROLES.PROVIDER)` to `/bookings` route (`bookings.routes.ts`)
- **BUG-BOOK-BE-027**: Missing RBAC on customers list route — any authenticated user could list all customers. Added `requireRole(ROLES.ADMIN, ROLES.PROVIDER)` to `/customers` route (`customers.routes.ts`)
- **BUG-BOOK-BE-028**: Missing RBAC on providers list route — any authenticated user could list all providers. Added `requireRole(ROLES.ADMIN, ROLES.PROVIDER)` to `/providers` route (`providers.routes.ts`)
- **BUG-BOOK-BE-029**: Missing RBAC on services list route — any authenticated user could list all services. Added `requireRole(ROLES.ADMIN, ROLES.PROVIDER)` to `/services` route (`services.routes.ts`)
- **BUG-BOOK-BE-030**: Missing RBAC on notifications list route — any authenticated user could list all notifications. Added `requireRole(ROLES.ADMIN, ROLES.PROVIDER)` to `/notifications` route (`notifications.routes.ts`)

### Fixed

- **BUG-BOOK-BE-004**: `parseDuration` function added to env config; `refreshExpiresInMs` used for refresh token expiry and cookie maxAge instead of `parseInt` (`config/env.ts`, `auth.service.ts`, `auth.controller.ts`)
- **BUG-BOOK-BE-006**: `refreshToken` in `refreshSchema` made optional since controller reads from cookies (`auth.dto.ts`)

### Confirmed

- **BUG-BOOK-BE-007**: Password complexity (min 8 chars, letters + numbers) already present in `registerSchema` and `inviteSchema` (`auth.dto.ts`)

## [1.0.0] — 2024-01-01

### Added
- Authentication system with JWT access + refresh tokens, bcrypt password hashing
- User management module (Admin only) with CRUD operations
- Services module with categories, duration, pricing, and provider assignment
- Providers module with working hours, service assignments, and bio
- Bookings module with Redis distributed lock for race condition prevention
- Schedule module with available slot calculation, time-off blocking
- Customers module with booking history and notes
- Notifications module with Nodemailer email integration (confirmation, reminder, cancellation)
- Dashboard module with stats: today/week bookings, revenue, top services/providers, no-show rate
- Settings module for business configuration (timezone, cancellation policy, buffer time)
- Prisma schema with 11 models and proper indexes
- Database seed with demo data (admin, providers, services, customers, bookings)
- Swagger/OpenAPI documentation at /api-docs
- Rate limiting (general + auth-specific)
- Zod validation on all inputs with detailed error responses
- Centralized error handling with AppError hierarchy
- RBAC middleware (Admin, Provider roles)
- Docker setup with multi-stage builds (backend + frontend)
- Docker Compose for production and development
- Nginx config for frontend serving with API proxy
- Cross-platform launch scripts (start.bat, start-docker.bat, start.sh, start-docker.sh)
- Architecture documentation with UX design, wireframes, and animation specs
- API documentation with all endpoints
- Database documentation with schema details
- Deployment documentation
