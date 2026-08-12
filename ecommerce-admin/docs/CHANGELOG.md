# Changelog

All notable changes to this project will be documented in this file.

## [1.0.1] — Unreleased

### Fixed
- **BUG-ECOM-BE-017:** Removed inconsistent "type": "module" from package.json to match CommonJS tsconfig configuration (`package.json`)
- **BUG-ECOM-BE-016:** Updated tsconfig.json module from CommonJS to Node16 and moduleResolution from node10 to node16 to fix deprecation warnings (`tsconfig.json`)
- **BUG-ECOM-BE-015:** Fixed .env path in env.ts from '../../.env' to '.env' for correct environment variable loading (`config/env.ts`)

### Security

- **BUG-ECOM-BE-001**: JWT secrets now use `required()` without fallback — no insecure defaults (`config/env.ts`)
- **BUG-ECOM-BE-004**: `Object.setPrototypeOf` added to all error classes for proper prototype chain (`shared/errors.ts`)
- **BUG-ECOM-BE-006**: Refresh tokens use `crypto.randomBytes(40)` instead of `jwt.sign` — opaque tokens (`auth.service.ts`)
- **BUG-ECOM-BE-009**: Rate limiter moved before routes and applied globally (`app.ts`)
- **BUG-ECOM-BE-010**: `authenticate` middleware added to static file serving (`app.ts`)
- **BUG-ECOM-BE-011**: `authLimiter` added to `/refresh` route (`auth.routes.ts`)
- **BUG-ECOM-BE-012**: `authenticate` middleware added to `/logout` route (`auth.routes.ts`)
- **BUG-ECOM-BE-013**: `role` removed from register swagger schema and input (`auth.routes.ts`)
- **BUG-ECOM-BE-018**: Removed insecure fallback value from `REDIS_URL` — now uses `required()` without fallback to prevent running with default credentials (`config/env.ts`)

### Fixed

- **BUG-ECOM-BE-002**: JWT expiry now configurable from env (`JWT_ACCESS_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN`) (`config/env.ts`)
- **BUG-ECOM-BE-003**: `dotenv.config()` now uses monorepo path resolution (`config/env.ts`)
- **BUG-ECOM-BE-005**: All `any` types removed — replaced with proper Prisma `Role` type and `jwt.SignOptions` (`auth.service.ts`, `auth.repository.ts`, `middleware/auth.ts`)
- **BUG-ECOM-BE-007**: `refresh()` already checks `isActive` — confirmed present (`auth.service.ts`)
- **BUG-ECOM-BE-008**: `logout()` now checks token existence before revoking (`auth.service.ts`)
- **BUG-ECOM-BE-014**: 404 catch-all route added before errorHandler (`app.ts`)

### Added

- `isProduction` / `isDevelopment` flags and `jwtRefreshExpiryMs` in env config
- Environment helper functions: `required()`, `optional()`, `optionalInt()`, `parseDuration()` (`config/env.ts`)
- Cookie `maxAge` now uses `env.jwtRefreshExpiryMs` instead of hardcoded 7 days (`auth.controller.ts`)

## [1.0.0] - 2024-01-15

### Added
- User authentication with JWT (access + refresh tokens)
- Product management with CRUD operations
- Category management with tree structure
- Order management with status tracking
- Customer management with segmentation
- Promo code management
- Analytics dashboard with revenue charts
- Settings management
- Docker deployment with multi-stage builds
- CI/CD pipeline with GitHub Actions
- Framer Motion page transitions and animations
- Dark mode support
- Responsive design (mobile, tablet, desktop)
