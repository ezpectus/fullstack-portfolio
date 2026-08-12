# Changelog

## [Unreleased]

### Fixed
- **BUG-INV-BE-009:** Added missing prisma scripts (prisma:generate, prisma:migrate, prisma:seed, prisma:studio) to package.json (`package.json`)
- **BUG-INV-BE-008:** Fixed .env path in env.ts from '../../.env' to '.env' for correct environment variable loading (`config/env.ts`)
- **BUG-INV-BE-002:** InvoicesService — all Prisma calls extracted to `invoices.repository.ts`; service uses repository methods exclusively, including interactive `transaction(fn)` for multi-table operations (`invoices.service.ts`, `invoices.repository.ts`)
- **BUG-INV-BE-003:** `/refresh` endpoint reads `refreshToken` from cookie first, body second; no `validateBody` on refresh route to avoid breaking cookie-based flow (`auth.controller.ts`, `auth.routes.ts`)
- **BUG-INV-BE-004:** `authService.invite` no longer returns tokens — invited user receives user object only and must authenticate separately (`auth.service.ts`)
- **BUG-INV-BE-005:** `errorHandler` — removed duplicate if/else branch with identical `console.error` call; simplified to single statement (`errorHandler.ts`)
- **BUG-INV-BE-006:** 404 catch-all route added to `app.ts` before errorHandler — returns `{ error: { code: 'NOT_FOUND', message: 'Route not found' } }` (`app.ts`)
- **BUG-INV-BE-007:** `refreshExpiresIn` — added `refreshExpiresInMs` computed value in env config; `auth.service.ts` and `auth.controller.ts` use `env.jwt.refreshExpiresInMs` instead of fragile `parseInt` on string (`env.ts`, `auth.service.ts`, `auth.controller.ts`)
- **BUG-INV-FE-001:** Frontend token refresh — axios response interceptor with concurrent refresh queue (`isRefreshing` + `failedQueue`); on 401, refreshes via httpOnly cookie and retries original request (`client.ts`)
- **BUG-INV-FE-002:** `ProtectedRoute` — `roles` prop applied to routes: Create Invoice (OWNER/ACCOUNTANT), Clients (OWNER/ACCOUNTANT), Reports (OWNER/ACCOUNTANT), Templates (OWNER/ACCOUNTANT), Settings (OWNER only) (`App.tsx`)
- **BUG-INV-FE-003:** Auth state restored on reload — `useAuthInit` hook calls `/auth/refresh` using httpOnly cookie, then fetches `/auth/me` to restore user session (`useAuthInit.ts`, `authStore.ts`)
- **BUG-INV-FE-004:** `Navigate` uses `replace` in ProtectedRoute and catch-all route to prevent back-button navigation to auth-protected pages (`App.tsx`)

## [1.0.0] - 2025-01-15

### Added
- User authentication with JWT access/refresh tokens
- User registration and login with bcrypt password hashing
- Company profile management with banking details
- Client CRUD with search and pagination
- Client balance tracking (billed, paid, outstanding)
- Invoice creation with multiple line items
- Automatic invoice numbering with company prefix
- Invoice status management (DRAFT, SENT, PAID, OVERDUE, CANCELLED)
- Invoice PDF generation with PDFKit
- Invoice email sending via Nodemailer
- Reusable line item templates
- Dashboard with monthly revenue charts and recent invoices
- Reports: revenue trend, overdue invoices, top clients
- Responsive UI with dark mode support
- Framer Motion animations (page transitions, staggered lists, modals)
- Docker and docker-compose configuration
- GitHub Actions CI/CD pipeline
- Swagger API documentation
- Seed data with demo account (demo@invoicegen.com / demo1234)
- Unit tests for auth and invoice DTOs
- Comprehensive documentation (ARCHITECTURE, API, DATABASE, DEPLOYMENT)

### Tech Stack
- Backend: Node.js 20, Express 4, TypeScript 5, Prisma 5, PostgreSQL 16
- Frontend: React 18, Vite 5, TailwindCSS 3, React Query 5, Zustand 4, Framer Motion
- Testing: Vitest
- CI/CD: GitHub Actions
