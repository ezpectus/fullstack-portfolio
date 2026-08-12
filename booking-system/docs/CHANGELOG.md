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
