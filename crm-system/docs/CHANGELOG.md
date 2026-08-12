# Changelog — CRM System

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed
- **BUG-CRM-BE-011:** Fixed .env path in env.ts from '../../.env' to '.env' for correct environment variable loading (`config/env.ts`)
- **BUG-CRM-DEP-001:** Added missing Dockerfile.backend for production Docker builds (`Dockerfile.backend`)
- **BUG-CRM-FE-001:** Sidebar now filters nav items by user role (`Sidebar.tsx`)
- **BUG-CRM-FE-002:** ProtectedRoute accepts `roles` prop for route-level RBAC (`App.tsx`)
- **BUG-CRM-FE-003:** Added `useLogout` hook that clears React Query cache on logout; Topbar updated to use it (`hooks/useLogout.ts`, `components/layout/Topbar.tsx`)
- **BUG-CRM-FE-004:** Added `AuthInitializer` component to restore auth state on reload (`components/AuthInitializer.tsx`)
- **BUG-CRM-FE-005:** Concurrent refresh token queue in API interceptor to prevent race conditions (`lib/api.ts`)
- **BUG-CRM-FE-006:** `useUsers` hook now accepts pagination params (page, limit, search) (`api/hooks.ts`)
- **BUG-CRM-FE-007:** `useDebounce` hook wired into `CustomersPage` for debounced search (300ms) to prevent excessive API calls (`hooks/useDebounce.ts`, `CustomersPage.tsx`)
- **BUG-CRM-BE-001:** Extracted `DashboardRepository` — no more direct Prisma calls in dashboard service (`dashboard.repository.ts`)
- **BUG-CRM-BE-002:** `usersService` now uses `usersRepository.findByEmail()` instead of direct Prisma (`users.service.ts`)
- **BUG-CRM-BE-003:** Replaced `Record<string, unknown>` with `Prisma.UserWhereInput` in users service (`users.service.ts`)
- **BUG-CRM-BE-004:** Added `MAX_PAGE_SIZE` check in customers controller (`customers.controller.ts`)
- **BUG-CRM-BE-005:** Added `MAX_PAGE_SIZE` check in deals controller (`deals.controller.ts`)
- **BUG-CRM-BE-006:** `noteQuerySchema` transforms `isPinned` string to boolean via Zod; controller now uses the transformed boolean directly instead of manual string comparison (`notes.dto.ts`, `notes.controller.ts`)
- **BUG-CRM-BE-007:** CSV injection protection in export (prefixes `=+-@` cells with single quote) (`customers.service.ts`, `deals.service.ts`)
- **BUG-CRM-BE-008:** Dashboard `getRecentActivity` filters notes by ownership for SALES_REP (`dashboard.service.ts`)
- **BUG-CRM-BE-009:** Added `authRateLimiter` on `/logout` route (`auth.routes.ts`)
- **BUG-CRM-BE-010:** `refreshTokenSchema` now has optional `refreshToken` field for cookie-based refresh (`auth.dto.ts`)
- **BUG-CRM-BE-011:** Health endpoint `/api/health` was defined before rate limiter middleware, creating potential DoS vector. Changed path from `/health` to `/api/health` and moved endpoint definition after `apiRateLimiter` to ensure rate limiting applies (`app.ts`, `tests/integration/app.test.ts`)
- **BUG-CRM-DB-001:** `Customer.assignedTo` relation now has `onDelete: SetNull` (`schema.prisma`)
- **BUG-CRM-DB-002:** `Deal.assignedTo` relation now has `onDelete: SetNull` (`schema.prisma`)

### Added
- Initial project structure
- Backend: Express + TypeScript + Prisma setup
- Frontend: React + Vite + TailwindCSS + shadcn/ui setup
- Auth module (register, login, refresh, logout)
- Users module (CRUD, RBAC)
- Customers module (CRUD, search, filter, pagination)
- Deals module (CRUD, kanban board, stage management)
- Notes module (CRUD, pin, attach to customer/deal)
- Dashboard module (stats, charts data)
- Export module (CSV export for customers and deals)
- Docker setup (docker-compose for production and development)
- Launch scripts (bat/sh for Windows and Linux/Mac)
- GitHub Actions CI pipeline
- Swagger/OpenAPI documentation
