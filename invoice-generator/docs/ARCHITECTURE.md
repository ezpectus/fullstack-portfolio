# Architecture — Invoice Generator

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Design System](#design-system)
- [Project Structure](#project-structure)

## Overview

The Invoice Generator is a full-stack application for creating, managing, and sending invoices with PDF generation and email capabilities.

## Tech Stack

- **Backend:** Node.js, Express, TypeScript, Prisma ORM, PostgreSQL, JWT auth, Zod validation
- **Frontend:** React 18, Vite, TailwindCSS, React Query, Zustand, Framer Motion, Recharts, Lucide icons
- **Infrastructure:** Docker, Docker Compose, Nginx reverse proxy

## Design System

- **Palette:** Minimalist green-white (primary: #16a34a, accents: teal)
- **Typography:** Inter (300–800 weights)
- **Dark mode:** Supported via `class` strategy
- **Animations:** Page transitions, staggered lists, animated counters, skeleton shimmer, scroll reveal, modal spring, toast slide

## Project Structure

```
invoice-generator/
├── backend/
│   ├── prisma/          # Schema, migrations, seed
│   ├── src/
│   │   ├── config/      # env, database
│   │   ├── middleware/  # auth, rbac, error, rateLimit, validate
│   │   ├── modules/     # auth, users, clients, company, invoices, templates, reports, dashboard, pdf, email
│   │   └── app.ts
│   └── tests/           # Integration tests
├── frontend/
│   ├── src/
│   │   ├── api/         # Axios client + endpoint definitions
│   │   ├── components/  # Layout, MotionComponents
│   │   ├── features/    # auth, dashboard, invoices, clients, reports, settings, templates
│   │   ├── lib/         # utils (cn, formatCurrency, formatDate, getStatusColor)
│   │   ├── store/       # Zustand auth store
│   │   ├── types/       # TypeScript interfaces
│   │   ├── App.tsx      # Routes with animated transitions
│   │   └── main.tsx     # Entry point
│   └── index.html
├── docs/                # Architecture, API, Database, Deployment
├── Dockerfile, Dockerfile.frontend, docker-compose.yml
└── README.md
```

## ER Diagram

```
User 1───* Invoice *───* InvoiceItem
Invoice ─── Client
User 1───1 Company
User 1───* Template
User 1───* Client
```

## Roles & Permissions

| Role | Permissions |
|------|------------|
| OWNER | Full access to all modules |
| ACCOUNTANT | CRUD invoices/clients, reports, dashboard |
| VIEWER | Read-only access |

## User Journey

1. **Login** → Authenticate with JWT
2. **Create Client** → Add client details
3. **Create Invoice** → Select client, add line items, auto-calc totals
4. **Preview PDF** → Download or preview in browser
5. **Send Email** → Invoice emailed to client, status → SENT
6. **Mark Paid** → Update status, track revenue
7. **View Dashboard** → Stats, charts, recent activity
8. **Reports** → Revenue, overdue, top clients, CSV export

### Wireframes

#### Dashboard
```
┌──────────────────────────────────────────────────────────┐
│  Sidebar        │  Dashboard                             │
│  - Dashboard    │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐  │
│  - Invoices     │  │Total │ │Billed│ │ Paid │ │Overdue│  │
│  - Create Inv   │  │  42  │ │$12.5K│ │$9.8K │ │$1.2K │  │
│  - Clients      │  └──────┘ └──────┘ └──────┘ └──────┘  │
│  - Templates    │                                        │
│  - Reports      │  ┌──────────────────────────────────┐  │
│  - Settings     │  │  Revenue (Billed vs Paid)        │  │
│                 │  │  ██████████████████              │  │
│                 │  └──────────────────────────────────┘  │
│                 │  ┌─────────────┐ ┌─────────────┐       │
│                 │  │ Status Break│ │ Recent Invs │       │
│                 │  │ Draft: 5    │ │ INV-042     │       │
│                 │  │ Sent: 12    │ │ INV-041     │       │
│                 │  │ Paid: 18    │ │ INV-040     │       │
│                 │  │ Overdue: 7  │ │ INV-039     │       │
│                 │  └─────────────┘ └─────────────┘       │
│                 │  ┌──────────────────────────────────┐  │
│                 │  │  Top Clients                     │  │
│                 │  │  Acme Corp      $45,200          │  │
│                 │  │  Globex Inc     $32,100          │  │
│                 │  └──────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

#### Invoice Create
```
┌──────────────────────────────────────────────────────────┐
│  Sidebar        │  ← Back   Create Invoice               │
│                 │                                        │
│                 │  Client:    [ Select client...      ▼] │
│                 │  Due Date:  [ 2024-12-31           ]   │
│                 │  Currency:  [ USD                ▼]    │
│                 │                                        │
│                 │  ┌──────────────────────────────────┐  │
│                 │  │ Line Items                       │  │
│                 │  │ Desc | Qty | Unit | Price | Tax  │  │
│                 │  │ ──────────────────────────────── │  │
│                 │  │ [Description....] [1] [pcs] [$0] │  │
│                 │  │ [+ Add Item]                     │  │
│                 │  └──────────────────────────────────┘  │
│                 │                                        │
│                 │  Notes: [Optional message to client...] │
│                 │                                        │
│                 │  ┌──────────────────────────────────┐  │
│                 │  │ Subtotal:          $0.00         │  │
│                 │  │ Tax:                $0.00        │  │
│                 │  │ Discount:           $0.00        │  │
│                 │  │ ══════════════════════════════   │  │
│                 │  │ Total:              $0.00        │  │
│                 │  └──────────────────────────────────┘  │
│                 │                                        │
│                 │  [Save Draft]  [Create & Preview]      │
└──────────────────────────────────────────────────────────┘
```

### Interactive Elements (Framer Motion)

| Element | Animation | Props |
|---------|-----------|-------|
| Page transitions | Fade + slide Y | `opacity: 0→1, y: 10→0, duration: 0.3, ease: easeOut` |
| Staggered list | Stagger children | `staggerChildren: 0.05, y: 15→0` |
| Dashboard cards | Scroll reveal | `opacity: 0→1, y: 30→0, whileInView, duration: 0.5` |
| Animated counter | Number count-up | `opacity: 0→1, y: 10→0, key={value}` |
| Modal/Dialog | Scale + fade spring | `scale: 0.95→1, opacity: 0→1, spring damping: 20` |
| Toast notifications | Slide-in from right | `x: 100→0, spring damping: 20, auto-dismiss` |
| Button hover/tap | Micro-interaction | `scale: 1.02 hover, 0.98 tap` |
| Invoice row hover | Background fade | `backgroundColor: rgba(0,0,0,0.02)` |
| Recent invoice hover | Slide right | `x: 4` |
| Theme toggle | Icon scale | `scale: 1.1 hover, 0.9 tap` |
| Skeleton shimmer | Gradient animation | `bg-gradient-to-r, bg-[length:200%_100%]` |
| `prefers-reduced-motion` | All animations disabled | `useReducedMotion()` hook + CSS media query |

### Responsive Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | < 640px | Single column, sidebar hidden (hamburger menu), stacked cards |
| Tablet | 640px–1024px | 2-column grids, sidebar visible, condensed tables |
| Desktop | > 1024px | Full sidebar + 4-column stat cards, side-by-side panels |

### UI States

| State | Implementation |
|-------|---------------|
| **Loading** | Skeleton placeholders (shimmer animation), card/table skeletons on dashboard and lists |
| **Error** | `ErrorState` component with alert icon, message, and retry button; per-page error boundaries |
| **Empty** | `EmptyState` component with icon, title, description, and CTA action button |
| **Offline** | React Query retry with exponential backoff, cached data shown when available |

## API Architecture

- RESTful endpoints under `/api`
- JWT access + refresh token flow
- Centralized error handling with custom error classes
- Rate limiting on auth endpoints
- Zod schema validation on all inputs
- RBAC middleware for role-based access

## Frontend Architecture

- React Router v6 with animated page transitions
- React Query for server state (caching, refetch, mutations)
- Zustand for client state (auth)
- Feature-based folder structure
- Reusable animation components (PageTransition, StaggerContainer, AnimatedCounter, Skeleton, Toast, ScrollReveal, AnimatedModal)
- Proxy: Vite dev server proxies `/api` to backend on port 4000

## Security

- bcrypt password hashing
- JWT access (15min) + refresh (7d) tokens
- Rate limiting: 100 req/15min general, 5 req/15min auth
- Helmet security headers
- CORS configured for frontend origin
- Input validation via Zod on every endpoint

## Design Decisions

### Repository Pattern for All Modules
All service modules (invoices, clients, dashboard, reports) now delegate database operations to dedicated repository classes. The `InvoicesRepository` exposes an interactive `transaction(fn)` method that accepts a `Prisma.TransactionClient` callback, enabling the service to compose multi-table operations (invoice creation + company counter increment) within a single transaction without direct `prisma` access.

### AccessToken in Memory (Zustand)
The frontend stores `accessToken` in Zustand state (memory) rather than `localStorage`. The Zustand `persist` middleware only persists `user` and `isAuthenticated` to localStorage (via `partialize`). On page reload, `useAuthInit` calls `/auth/refresh` using the httpOnly cookie to obtain a new access token, restoring the session without exposing the token to XSS.

### useLogout with QueryClient.clear()
The `useLogout` hook clears the React Query cache after logout to prevent stale data from being visible to the next user session. Layout.tsx delegates logout to this hook.

### Role-Based Navigation Filtering
Sidebar nav items include a `roles` array. The Layout component filters items by `user.role`, ensuring VIEWER users don't see Create Invoice, Clients, Templates, Reports, or Settings links. `ProtectedRoute` also accepts a `roles` prop for route-level RBAC.

### CSV Injection Protection
The `exportRevenueCsv` method in reports service prefixes cell values starting with `=`, `+`, `-`, or `@` with a single quote to prevent CSV injection attacks when opened in spreadsheet applications.

### Invite Without Tokens
The `authService.invite` method creates a new user but does not return access/refresh tokens. The invited user must authenticate separately via `/auth/login`. This prevents token leakage to the inviting user.

### Refresh Token Expiry in Milliseconds
The `env.jwt.refreshExpiresInMs` value is pre-computed at startup as `optionalInt('JWT_REFRESH_EXPIRES_IN', 7) * 24 * 60 * 60 * 1000`. This avoids fragile `parseInt` on string values at runtime and provides a consistent millisecond value for both cookie `maxAge` and refresh token `expiresAt`.

### Role-Based Route Guards
`ProtectedRoute` accepts a `roles` prop and redirects unauthorized users to `/` with `replace`. Routes are guarded as follows: Create Invoice (OWNER/ACCOUNTANT), Clients (OWNER/ACCOUNTANT), Reports (OWNER/ACCOUNTANT), Templates (OWNER/ACCOUNTANT), Settings (OWNER only). VIEWER users can only access Dashboard and invoice list/detail views.
