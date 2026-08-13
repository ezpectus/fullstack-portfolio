# Changelog — Library Management System

## [Unreleased]

### Fixed
- **BUG-LIB-DEP-002:** Added missing Dockerfile.backend for production Docker builds (`Dockerfile.backend`)
- **BUG-LIB-BE-013:** Removed inconsistent "type": "module" from package.json to match CommonJS tsconfig configuration (`package.json`)
- **BUG-LIB-BE-012:** Updated tsconfig.json module from CommonJS to Node16 and moduleResolution from node10 to node16 to fix deprecation warnings (`tsconfig.json`)
- **BUG-LIB-BE-011:** Fixed .env path in env.ts from '../../.env' to '.env' for correct environment variable loading (`config/env.ts`)
- **BUG-LIB-BE-001:** LoansService — replaced direct `prisma` calls in `create` and `returnBook` with repository Tx methods (`loans.service.ts`, `loans.repository.ts`)
- **BUG-LIB-BE-002:** FinesService — already class-based with repository pattern, no changes needed (`fines.service.ts`)
- **BUG-LIB-BE-003:** DashboardRepository — already extracted, no direct Prisma in service (`dashboard.repository.ts`)
- **BUG-LIB-BE-004:** LoansRepository — already has `findForRenew` and `findPendingReservations` (`loans.repository.ts`)
- **BUG-LIB-BE-005:** `refreshSchema` — `refreshToken` is now optional for cookie-based refresh (`auth.dto.ts`)
- **BUG-LIB-BE-006:** `authLimiter` applied to `/logout` route (`auth.routes.ts`)
- **BUG-LIB-BE-007:** `/invite` endpoint and route already present (`auth.routes.ts`, `auth.controller.ts`)
- **BUG-LIB-BE-008:** `/loans/my` endpoint for MEMBER role already present (`loans.routes.ts`)
- **BUG-LIB-BE-009:** `Loan.librarianId` is optional with `onDelete: SetNull` (`schema.prisma`)
- **BUG-LIB-BE-010:** `/reservations/:id/fulfill` endpoint already present (`reservations.routes.ts`)
- **BUG-LIB-FE-001:** Sidebar — role-based nav filtering with `roles` array on nav items (`Sidebar.tsx`)
- **BUG-LIB-FE-002:** ProtectedRoute — `roles` prop for route-level RBAC (`App.tsx`)
- **BUG-LIB-FE-003:** `useLogin` now uses `setAuth` (Zustand in-memory state) instead of `localStorage.setItem` for accessToken — prevents XSS token theft (`hooks/useAuth.ts`, `store/authStore.ts`)
- **BUG-LIB-FE-004:** `useLogout` hook now calls `queryClient.clear()` to prevent stale data (`hooks/useLogout.ts`)
- **BUG-LIB-FE-005:** `useDebounce` hook for debounced search inputs (`hooks/useDebounce.ts`)

### Security
- CSV injection protection added to `exportCsv` — cells starting with `=+-@` are prefixed with `'` (`reports.service.ts`)
- **BUG-LIB-BE-014**: Removed insecure fallback value from `REDIS_URL` — now uses `required()` without fallback to prevent running with default credentials (`config/env.ts`)
- **BUG-LIB-BE-015**: Health endpoint `/api/health` already protected by rate limiter middleware — confirmed no DoS vulnerability (`app.ts`)
- **BUG-LIB-BE-016**: Missing RBAC in reservations routes — create and cancel had no role checks. Added `requireRole(ROLES.ADMIN, ROLES.LIBRARIAN, ROLES.MEMBER)` to create and cancel (`reservations.routes.ts`)
- **BUG-LIB-BE-017**: Missing RBAC in reports routes — popular-genres endpoint had no role checks. Added `requireRole(ROLES.ADMIN, ROLES.LIBRARIAN)` to popular-genres route (`reports.routes.ts`)
- **BUG-LIB-BE-018**: Missing rate limiting on invite route — `/invite` endpoint lacked `authLimiter`, creating potential DoS vector. Added `authLimiter` to prevent abuse (`auth.routes.ts`)
- **BUG-LIB-BE-019**: Missing RBAC on books list route — any authenticated user could list all books. Added `requireRole(ROLES.ADMIN, ROLES.LIBRARIAN, ROLES.MEMBER)` to `/books` route (`books.routes.ts`)
- **BUG-LIB-BE-020**: Missing RBAC on book-copies list route — any authenticated user could list all book copies. Added `requireRole(ROLES.ADMIN, ROLES.LIBRARIAN, ROLES.MEMBER)` to `/book-copies` route (`book-copies.routes.ts`)
- **BUG-LIB-BE-021**: Missing RBAC on getById routes — any authenticated user could access individual resources. Added `requireRole(ROLES.ADMIN, ROLES.LIBRARIAN, ROLES.MEMBER)` to GET /:id routes in books and book-copies modules (`books.routes.ts`, `book-copies.routes.ts`)
- **BUG-LIB-BE-022**: Missing RBAC on dashboard route — any authenticated user could access dashboard stats. Added `requireRole(ROLES.ADMIN, ROLES.LIBRARIAN)` to `/dashboard` route (`dashboard.routes.ts`)
- **BUG-LIB-BE-023**: CORS origins used insecure fallback — `CORS_ORIGINS` had default localhost fallback, potentially allowing unintended origins in production. Changed to `required()` to force explicit configuration (`config/env.ts`)

## [1.0.0] — 2025-01-15

### Added

- **Auth**: JWT authentication with access + refresh tokens, register, login, role-based access control (ADMIN, LIBRARIAN, MEMBER)
- **Books**: CRUD with ISBN, title, authors, publisher, year, genre, description, cover URL, category tree
- **Book Copies**: CRUD with unique code, status (available/borrowed/reserved/lost/damaged), condition tracking
- **Members**: CRUD with library card numbers, status management, loan history, fine tracking
- **Loans**: Issue, return, renew with due dates, overdue detection, automatic fine calculation
- **Reservations**: Create, cancel, fulfill with expiry management
- **Fines**: Automatic calculation, pay, waive functionality
- **Dashboard**: Aggregate statistics (total books, copies, active members, monthly loans), popular books top 10
- **Reports**: Loan statistics by month, popular genres, overdue loans, damaged/lost copies, CSV export
- **Frontend**: React 18 + Vite 5 + TailwindCSS 3 with Framer Motion animations
  - Page transitions (fade + slide)
  - List staggered animations
  - Button micro-interactions (hover, tap, loading)
  - Skeleton shimmer loading
  - Number counters for dashboard metrics
  - Scroll reveal for dashboard widgets
  - Modal scale + fade animations
- **Docker**: Multi-stage Dockerfiles for backend and frontend, docker-compose.yml with PostgreSQL, Redis, backend, frontend
- **Launch scripts**: start.bat, start.sh, start-docker.bat, start-docker.sh
- **Tests**: Unit tests for DTOs (Zod validation), integration tests for API endpoints
- **Docs**: ARCHITECTURE.md, API.md, DATABASE.md, DEPLOYMENT.md
- **Security**: Helmet, CORS, rate limiting, input validation (Zod), bcrypt password hashing
