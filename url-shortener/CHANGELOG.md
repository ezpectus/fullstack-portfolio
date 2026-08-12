# Changelog

## [1.0.1] — Unreleased

### Security
- **BUG-URL-BE-001**: Missing RBAC in links bulk create — any authenticated user could bulk create links. Added `requireAdmin` middleware to `/bulk` endpoint (`links.routes.ts`)
- **BUG-URL-BE-002**: Removed insecure fallback value from `REDIS_URL` — now uses `required()` without fallback to prevent running with default credentials (`config/env.ts`)
- **BUG-URL-BE-003**: Health endpoint `/api/health` was defined before rate limiter middleware, creating potential DoS vector. Changed path from `/health` to `/api/health` and moved endpoint definition after `apiRateLimiter` to ensure rate limiting applies (`app.ts`)
- **BUG-URL-BE-004**: Query parameter validation bypass in redirect route — used unsafe type casting `req.query.password as string | undefined`. Added `passwordQuerySchema` with Zod validation (`redirect.routes.ts`)

## [1.0.0] — 2025-01-15

### Added

#### Backend
- Express + TypeScript API with feature-based module architecture (auth, users, links, redirect, qr, analytics, api-keys, dashboard, settings)
- Prisma ORM with PostgreSQL — 5 models: User, ShortLink, Click, ApiKey, Settings
- Redis cache for O(1) redirect lookup with 24h TTL
- JWT authentication with access (15min) + refresh (7d) tokens
- Zod validation on all request bodies, params, and queries
- Custom error hierarchy: AppError, NotFoundError, UnauthorizedError, ForbiddenError, BadRequestError, ConflictError
- Middleware: authenticate, requireAdmin, validateBody/Params/Query, rateLimit, errorHandler, asyncHandler
- Short link features: custom aliases, expiry dates, password protection, bulk CSV import
- Click tracking: IP, User-Agent, Referer, device, browser, country, unique visitor flag
- QR code generation as PNG and SVG via qrcode library
- Analytics: total/unique clicks, daily breakdown, top countries, devices, browsers, referers
- Dashboard: aggregated stats, 30-day click chart, top links, recent links
- API key management for programmatic access
- User settings: custom domain, code length, domain blacklist
- Swagger API docs at `/api-docs`
- Seed data: admin + demo users, 5 sample links, 10-50 random clicks per link
- Unit tests: auth DTO, links DTO, validate middleware, error classes
- Integration tests: health check, auth validation, protected endpoint 401s, redirect 404

#### Frontend
- React 18 + Vite 5 + TypeScript SPA
- TailwindCSS 3 with custom purple-neon theme (glassmorphism, neon borders, gradient text)
- shadcn/ui-style components: Button, Card, Input, Badge, Modal, Skeleton, EmptyState
- Framer Motion animations: page transitions, stagger lists, modals, animated counters, scroll reveal, skeleton shimmer
- `prefers-reduced-motion` support throughout
- Zustand stores: authStore (persisted), themeStore (persisted, dark default), toastStore
- React Query 5 hooks for all API endpoints with automatic cache invalidation
- Axios client with JWT auth interceptor and 401 auto-logout
- React Router 6 with protected routes and lazy loading
- Pages: Login, Register, Dashboard, Links list, Link detail, Analytics, QR codes, API keys, Settings, 404
- Recharts integration: line charts (clicks over time), bar charts (countries, browsers), pie charts (devices)
- Toast notification system with auto-dismiss
- Search, status filter, and pagination on links list
- Create link modal with URL + custom alias
- QR code generation with download (PNG)
- API key CRUD with copy-to-clipboard
- Settings form: domain, code length, blacklist
- Frontend unit tests: authStore, toastStore, cn utility
- `vite-env.d.ts` for Vite type support

#### Infrastructure
- Monorepo structure with separate backend/frontend packages
- Docker Compose for PostgreSQL, Redis, backend, frontend
- Dockerfiles for backend (Node) and frontend (Nginx)
- Quick start scripts: `start.bat`, `start.sh`, `start-docker.bat`, `start-docker.sh`
- `.env.example` with all environment variables documented
- Documentation: README.md, CONTRIBUTING.md, ARCHITECTURE.md, API.md, DATABASE.md, DEPLOYMENT.md

### Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js 20+, Express 4, TypeScript 5 |
| ORM | Prisma 5 |
| Database | PostgreSQL 16 |
| Cache | Redis 7 |
| Frontend | React 18, Vite 5, TailwindCSS 3 |
| State | React Query 5, Zustand 4 |
| Animations | Framer Motion |
| Charts | Recharts |
| Icons | Lucide React |
| Testing | Vitest + Supertest |
| Validation | Zod |
| Auth | JWT + bcrypt |
