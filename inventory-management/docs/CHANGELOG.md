# Changelog — Inventory Management System

## [Unreleased]

### Fixed
- **BUG-INV-MGMT-BE-012:** Removed inconsistent "type": "module" from package.json to match CommonJS tsconfig configuration (`package.json`)
- **BUG-INV-MGMT-BE-011:** Updated tsconfig.json module from CommonJS to Node16 and moduleResolution from node10 to node16 to fix deprecation warnings (`tsconfig.json`)
- **BUG-INV-MGMT-BE-010:** Fixed .env path in env.ts from '../../.env' to '.env' for correct environment variable loading (`config/env.ts`)
- **BUG-INV-MGMT-BE-001:** Auth controller — converted from spread operator array pattern (`...authController.register`) to standard exported handler functions; validation middleware moved to routes (`auth.controller.ts`, `auth.routes.ts`)
- **BUG-INV-MGMT-BE-002:** `/logout` route now requires `authenticate` middleware (`auth.routes.ts`)
- **BUG-INV-MGMT-BE-003:** `/logout` route now protected by `authLimiter` (`auth.routes.ts`)
- **BUG-INV-MGMT-BE-004:** Export controller — converted from class-based array wrapper pattern to standard exported handler functions; routes updated to use direct handler imports (`export.controller.ts`, `export.routes.ts`)
- **BUG-INV-MGMT-BE-005:** CSV injection protection — `escapeCsvField` function prefixes cells starting with `=+-@` with single quote (`export.service.ts`)
- **BUG-INV-MGMT-BE-006:** `products.service.getById` — `NotFoundError` thrown in repository when product not found (`products.repository.ts`)
- **BUG-INV-MGMT-BE-008:** `refreshExpiresIn` — added `refreshExpiresInMs` computed value in env config; `auth.service.ts` and `auth.controller.ts` use `env.jwt.refreshExpiresInMs` instead of fragile `parseInt` on string (`env.ts`, `auth.service.ts`, `auth.controller.ts`)
- **BUG-INV-MGMT-BE-009:** Input validation — `validateBody(registerSchema)`, `validateBody(loginSchema)`, and `validateBody(inviteSchema)` now applied explicitly in auth routes (`auth.routes.ts`)

## [1.0.0] — 2025-01-15

### Added

- **Auth**: JWT authentication with access + refresh tokens, register, login, role-based access control (ADMIN, MANAGER, STAFF)
- **Products**: CRUD with SKU, barcode generation, category assignment, min stock levels, cost/sell pricing, image URLs
- **Categories**: CRUD with nested tree structure, product filtering
- **Warehouses**: CRUD with address, manager assignment, stock levels per warehouse
- **Stock Movements**: In/out/transfer/adjustment with product, warehouse, type, quantity, comment, user tracking
- **Suppliers**: CRUD with contact name, email, phone, address
- **Purchase Orders**: Draft/sent/received/cancelled statuses, line items, auto stock movement on receive
- **Dashboard**: Total inventory value, low-stock alerts, top products by value, movement chart, pending/received POs
- **Export**: CSV export for products, stock levels, movements; PDF barcode labels
- **Frontend**: React 18 + Vite 5 + TailwindCSS 3 with Framer Motion animations
  - Page transitions (fade + slide)
  - Product card hover animations
  - Stock movement quantity animations
  - Barcode reveal animation
  - List staggered animations
  - Button micro-interactions
  - Skeleton shimmer loading
  - Dashboard scroll reveal
  - Number counters for metrics
  - Low-stock alert pulse
- **Docker**: Multi-stage Dockerfiles, docker-compose.yml with PostgreSQL, Redis, backend, frontend
- **Launch scripts**: start.bat, start.sh, start-docker.bat, start-docker.sh
- **Tests**: Unit tests for DTOs, integration tests for API endpoints
- **Docs**: ARCHITECTURE.md, API.md, DATABASE.md, DEPLOYMENT.md
- **Security**: Helmet, CORS, rate limiting, input validation (Zod), bcrypt password hashing
