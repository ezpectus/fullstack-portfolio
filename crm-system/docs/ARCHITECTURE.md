# Architecture — CRM System

## Table of Contents

- [Overview](#overview)
- [Layers](#layers)
  - [Controller Layer](#1-controller-layer)
  - [Service Layer](#2-service-layer)
  - [Repository Layer](#3-repository-layer)
- [Module Structure](#module-structure)
- [Middleware Pipeline](#middleware-pipeline)
- [Authentication Flow](#authentication-flow)
- [RBAC](#rbac)
- [Redis Usage](#redis-usage)
- [UX Design](#ux-design)

## Overview

The CRM System follows a **Clean Architecture** approach with **feature-based modules**. Each feature is self-contained with its own controller, service, repository, routes, DTO, and tests.

## Layers

```
Request → Controller (validation via Zod DTO) → Service (business logic) → Repository (data access via Prisma) → Database
```

### 1. Controller Layer
- Receives HTTP requests
- Validates input using Zod schemas (DTO)
- Calls the appropriate service method
- Returns HTTP responses

### 2. Service Layer
- Contains business logic
- Orchestrates repository calls
- Handles transactions
- Throws typed errors for the error middleware

### 3. Repository Layer
- Abstracts Prisma ORM
- Handles database queries
- Returns domain entities
- Enables easy mocking in tests

## Module Structure

Each module in `modules/` follows the same pattern:

```
modules/<feature>/
├── <feature>.controller.ts   ← HTTP handlers
├── <feature>.service.ts      ← Business logic
├── <feature>.repository.ts   ← Data access
├── <feature>.routes.ts       ← Express router
├── <feature>.dto.ts          ← Zod validation schemas
└── <feature>.test.ts         ← Unit tests
```

## Middleware Pipeline

```
Request → Helmet → CORS → RateLimit → BodyParser → Auth → RBAC → Route → ErrorHandler
```

## Authentication Flow

```
1. POST /auth/register → create user + hash password (bcrypt)
2. POST /auth/login → verify password → issue access (15m) + refresh (7d) tokens
3. Access token in Authorization: Bearer <token>
4. Refresh token in httpOnly cookie
5. POST /auth/refresh → verify refresh token → issue new access token
6. POST /auth/logout → invalidate refresh token
```

## RBAC

Three roles with cascading permissions:
- **Admin:** full access
- **Manager:** CRUD on team's data
- **Sales Rep:** CRUD on own data only

## Redis Usage

- Session caching
- Rate limiting counters
- Frequently accessed dashboard stats cache

## UX Design

### User Journey

```
Login → Dashboard (overview metrics) → Customers (list) → Create Customer → Customer Detail (timeline) → Create Deal → Deals Kanban (drag-and-drop) → Add Note → Dashboard (updated metrics)
```

1. **Login:** User signs in with email/password → redirected to Dashboard
2. **Dashboard:** Views key metrics (total customers, active deals, pipeline amount, won this month), charts (deals by stage, new customers trend), recent activity feed
3. **Customers:** Searches/filters customer list → clicks customer → sees detail with timeline of interactions
4. **Create Customer:** Opens dialog → fills form (name, company, email, phone, status, tags) → saves
5. **Create Deal:** From customer detail or deals page → fills form (title, amount, stage, probability, expected close date) → deal appears on Kanban
6. **Kanban:** Drags deal cards between stages (New → Contacted → Qualified → Proposal → Won/Lost) → stage updates in real-time
7. **Notes:** Creates notes attached to customer or deal → pins important notes → views notes list
8. **Export:** Downloads customers or deals as CSV

### Color Palette

**Business Blue-Gray Theme:**

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--primary` | `hsl(221, 83%, 53%)` | `hsl(217, 91%, 60%)` | Buttons, active states, links |
| `--background` | `hsl(0, 0%, 100%)` | `hsl(222, 84%, 5%)` | Page background |
| `--card` | `hsl(0, 0%, 100%)` | `hsl(222, 84%, 5%)` | Cards, panels |
| `--muted` | `hsl(210, 40%, 96%)` | `hsl(217, 33%, 18%)` | Muted backgrounds |
| `--accent` | `hsl(210, 40%, 96%)` | `hsl(217, 33%, 18%)` | Hover states |
| `--destructive` | `hsl(0, 84%, 60%)` | `hsl(0, 63%, 31%)` | Delete, error |
| `--border` | `hsl(214, 32%, 91%)` | `hsl(217, 33%, 18%)` | Borders, dividers |

**Accent colors for deal stages:**
- New: `blue-500`
- Contacted: `indigo-500`
- Qualified: `violet-500`
- Proposal: `amber-500`
- Won: `green-500`
- Lost: `red-500`

### Typography

- **Font family:** Inter (system-ui fallback)
- **Heading scale:**
  - H1: 2xl (24px), font-semibold
  - H2: xl (20px), font-semibold
  - H3: lg (18px), font-semibold
  - H4: base (16px), font-medium
- **Body:** sm (14px), font-normal
- **Caption:** xs (12px), text-muted-foreground

### Wireframes

**Dashboard:**
```
┌─────────────────────────────────────────────┐
│  [Metric Card] [Metric Card] [Metric Card]  │
│  [Metric Card]                               │
│                                              │
│  ┌──────────────┐  ┌──────────────────────┐ │
│  │ Deals by     │  │ New Customers        │ │
│  │ Stage (Bar)  │  │ (Line Chart)         │ │
│  └──────────────┘  └──────────────────────┘ │
│                                              │
│  ┌─────────────────────────────────────────┐│
│  │ Recent Activity Feed                    ││
│  │ • Deal "Website Redesign" → Won         ││
│  │ • Customer "Acme Corp" created          ││
│  │ • Note added to "Consulting Deal"       ││
│  └─────────────────────────────────────────┘│
└─────────────────────────────────────────────┘
```

**Customers List:**
```
┌─────────────────────────────────────────────┐
│ [Search...] [Status: All ▾] [+ Add Customer]│
│                                              │
│ ┌──┬──────────┬───────┬──────┬──────┬─────┐ │
│ │  │ Name     │Company│Status│Tags  │Deals│ │
│ ├──┼──────────┼───────┼──────┼──────┼─────┤ │
│ │  │ J. Smith │ Acme  │ Lead │ VIP  │  3  │ │
│ │  │ M. Jones │ Glob  │Active│      │  7  │ │
│ └──┴──────────┴───────┴──────┴──────┴─────┘ │
│                              ‹ 1 2 3 ... ›   │
└─────────────────────────────────────────────┘
```

**Deals Kanban:**
```
┌────────┬──────────┬──────────┬──────────┬────────┐
│  New   │Contacted │Qualified │Proposal  │Won/Lost│
│        │          │          │          │        │
│ ┌────┐ │ ┌────┐   │ ┌────┐   │ ┌────┐   │        │
│ │Deal│  │ │Deal│   │ │Deal│   │ │Deal│   │        │
│ │$5k │  │ │$12k│   │ │$8k │   │ │$20k│   │        │
│ └────┘ │ └────┘   │ └────┘   │ └────┘   │        │
│        │          │          │          │        │
│ ┌────┐ │          │ ┌────┐   │          │        │
│ │Deal│  │          │ │Deal│   │          │        │
│ └────┘ │          │ └────┘   │          │        │
└────────┴──────────┴──────────┴──────────┴────────┘
```

### Interactive Elements

- **Kanban drag-and-drop:** Drag deal cards between stage columns. Card scales up with shadow while dragging (spring physics). Stage updates on drop.
- **Customer search:** Debounced search input filters customer list in real-time
- **Filter dropdowns:** Status filter, tag filter with animated dropdown
- **Pagination:** Animated page transitions with number buttons
- **Create/Edit dialogs:** Scale + fade animation on open/close
- **Note pinning:** Click pin icon to toggle pinned state with rotation animation
- **Toast notifications:** Slide-in from right with auto-dismiss after 4s
- **Dark mode toggle:** Smooth color transition between light/dark themes
- **Sidebar navigation:** Active item highlight with layout animation

### Empty States

- **No customers:** "No customers yet. Add your first customer to start managing relationships." + "Add Customer" button
- **No deals:** "No deals found. Create a deal to track your sales pipeline." + "Create Deal" button
- **No notes:** "No notes yet. Add notes to keep track of important details." + "Add Note" button
- **No search results:** "No results found. Try adjusting your search or filters."

### Loading States

- **Dashboard:** Skeleton cards for metrics, skeleton chart areas
- **Lists:** Skeleton table rows with avatar placeholder, text lines
- **Detail pages:** Skeleton profile header, skeleton timeline items
- **Buttons:** Spinner icon + disabled state during mutations

### Error States

- **API errors:** Error state component with message + "Retry" button
- **Form validation:** Inline error messages below inputs (red text)
- **404:** "Page not found" with link back to dashboard
- **401:** Auto-redirect to login page

### Responsive Breakpoints

- **Mobile (320-768px):** Single column layout, sidebar hidden (hamburger menu), cards stack vertically, Kanban becomes horizontal scroll
- **Tablet (768-1024px):** Two-column dashboard, sidebar visible, tables show key columns
- **Desktop (1024px+):** Full sidebar, multi-column dashboard, full Kanban board, all table columns visible

## Design Decisions

### DashboardRepository Extraction
The dashboard service originally used Prisma directly, violating the repository pattern used by all other modules. A `DashboardRepository` was introduced to maintain consistency and enable testability.

### Concurrent Refresh Token Queue
The API client interceptor uses a singleton `refreshPromise` to prevent race conditions when multiple requests receive 401 simultaneously. All queued requests await the same refresh call and retry with the new token.

### AuthInitializer on Reload
When the page reloads, Zustand persist restores `isAuthenticated` and `user` from localStorage. The `AuthInitializer` component calls `useMe()` on mount to verify the session is still valid. If the refresh token is expired, it logs out the user.

### useLogout with QueryClient.clear()
The `useLogout` hook clears the React Query cache after logout to prevent stale data from being visible to the next user. This is critical for multi-user environments.

### CSV Injection Protection
Export services prefix cell values starting with `=`, `+`, `-`, or `@` with a single quote to prevent CSV formula injection attacks in spreadsheet applications.

### onDelete: SetNull for Assignments
`Customer.assignedTo` and `Deal.assignedTo` relations use `onDelete: SetNull` so that deleting a user doesn't cascade-delete their assigned customers/deals — the assignment is simply cleared.

### Rate Limiting on All Auth Endpoints
All authentication endpoints (`/register`, `/login`, `/refresh`, `/logout`) are protected by `authRateLimiter` (5 requests per 15 minutes) to prevent brute-force attacks.

### Refresh Token Schema (Cookie-Based)
The `refreshTokenSchema` has an optional `refreshToken` field because the refresh token is primarily read from the httpOnly cookie. The body field is optional for fallback scenarios.

## Database Schema

See [DATABASE.md](./DATABASE.md) for ER diagram and table definitions.
