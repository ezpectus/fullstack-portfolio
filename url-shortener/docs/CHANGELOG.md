# URL Shortener — Changelog

## [1.0.1] — Unreleased

### Fixed
- **BUG-URL-BE-016:** Added missing prisma:studio script to package.json (`package.json`)
- **BUG-URL-BE-015:** Fixed .env path in env.ts from '../../.env' to '.env' for correct environment variable loading (`config/env.ts`)
- **BUG-URL-DEP-001:** Added missing Dockerfile.backend for production Docker builds (`Dockerfile.backend`)

### Security

- **BUG-URL-BE-001**: API keys now hashed via SHA-256 before storage — plaintext keys never persisted (`api-keys.repository.ts`)
- **BUG-URL-BE-002**: GET `/api-keys` returns masked keys only — plaintext shown only once on creation (`api-keys.service.ts`)
- **BUG-URL-BE-008**: `authenticate` middleware added to `/logout` route (`auth.routes.ts`)
- **BUG-URL-BE-009**: `authRateLimiter` added to `/me` route (`auth.routes.ts`)
- **BUG-URL-BE-011**: `requireAdmin` now uses `ROLES` constant from `shared/constants.ts` instead of hardcoded string (`middleware/auth.ts`)
- **BUG-URL-BE-014**: Analytics endpoints confirmed to have ownership checks (`analytics.routes.ts`)

### Changed

- **BUG-URL-BE-003**: `links.service` refactored from object literal to class-based `LinksService` (`links.service.ts`)
- **BUG-URL-BE-004**: `links.service` no longer accesses Prisma directly — `getSettings` method added to repository (`links.repository.ts`, `links.service.ts`)
- **BUG-URL-BE-005**: `api-keys.routes` now uses `apiKeysService` instead of direct Prisma calls (`api-keys.routes.ts`)
- **BUG-URL-BE-007**: `redirect.routes` extracted to `redirect.service` + `redirect.repository` — routes are thin controllers (`redirect.routes.ts`, `redirect.service.ts`, `redirect.repository.ts`)
- **BUG-URL-BE-010**: Refresh token expiry now uses `env.jwtRefreshExpiry` with proper duration parsing (`auth.service.ts`)
- **BUG-URL-BE-012**: `links.service.update` now accepts typed `UpdateLinkInput` instead of `Record<string, unknown>` (`links.service.ts`)

### Added

- **BUG-URL-BE-013**: `shared/constants.ts` with `ROLES` constant for consistent role references
- `redirect.service.ts` and `redirect.repository.ts` — proper separation of concerns for redirect logic
- `hashApiKey` and `maskApiKey` utility functions in `api-keys.repository.ts`

## [1.0.0] — 2026-08-10

### Added

- **Auth**: JWT access + refresh token authentication, register, login, logout, refresh, me endpoints
- **Users**: User profile CRUD with role-based access (admin, user)
- **Links**: Short link CRUD with custom aliases, expiry dates, password protection, bulk CSV import
- **Redirect**: 301 redirect with Redis cache for O(1) lookup, click tracking (IP, user-agent, referer, device, browser)
- **QR Codes**: Generate and download QR codes as PNG/SVG for any short link
- **Analytics**: Click statistics — total/unique, daily chart, top countries, devices, browsers, referers
- **API Keys**: CRUD API keys for programmatic access with Bearer token authentication
- **Dashboard**: Overview stats (total/active links, total clicks), 30-day click chart, top links, recent links
- **Settings**: User settings — custom domain, code length, domain blacklist
- **Frontend**: React + Vite + TailwindCSS with glassmorphism design, Framer Motion animations
- **Infrastructure**: Docker multi-stage builds, docker-compose (app + db + redis), launch scripts (bat/sh)
- **Testing**: Unit tests for shared errors, integration tests for app health
- **Documentation**: ARCHITECTURE.md, API.md, DATABASE.md, DEPLOYMENT.md
- **CI**: GitHub Actions workflow for lint, test, build
