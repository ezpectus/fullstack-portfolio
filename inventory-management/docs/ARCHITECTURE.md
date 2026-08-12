# Architecture — Inventory Management System

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)

## Overview

A full-stack inventory management system for tracking warehouse stock, products, suppliers, purchase orders, and stock movements. Built with Node.js/Express backend and React/Vite frontend.

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js 20+, Express 4, TypeScript 5 |
| ORM | Prisma 5 |
| Database | PostgreSQL 16 |
| Cache | Redis 7 |
| Frontend | React 18, Vite 5, TailwindCSS 3 |
| State | React Query 5 (server), Zustand 4 (client) |
| Animations | Framer Motion |
| Charts | Recharts |
| Barcode | jsbarcode |
| Auth | JWT (access + refresh), bcrypt |
| Validation | Zod |
| Testing | Vitest + Supertest |

## Architecture

### Backend

```
backend/src/
├── config/          ← env, db, redis, swagger
├── middleware/      ← auth, rbac, validate, rateLimit, errorHandler, asyncHandler
├── modules/         ← Feature-based modules
│   ├── auth/        ← register, login, refresh, me
│   ├── users/       ← CRUD users
│   ├── products/    ← CRUD products, search, barcode
│   ├── categories/  ← CRUD categories, tree structure
│   ├── warehouses/  ← CRUD warehouses, stock levels
│   ├── stock-movements/ ← in/out/transfer/adjustment
│   ├── suppliers/   ← CRUD suppliers
│   ├── purchase-orders/ ← CRUD POs, receive → auto stock movement
│   ├── dashboard/   ← stats, alerts, charts
│   └── export/      ← CSV + PDF labels
├── shared/          ← errors, types, utils
└── app.ts           ← Express app setup
```

Each module follows the 3-layer pattern:
- **Controller** → handles HTTP, calls service
- **Service** → business logic, calls repository
- **Repository** → Prisma database queries

### Frontend

```
frontend/src/
├── api/             ← axios client, endpoint definitions
├── components/      ← UI (Button, Input, Card), Layout, Animations
├── features/        ← Feature-based pages
│   ├── auth/        ← Login, Register
│   ├── dashboard/   ← Stats, charts, low-stock alerts
│   ├── products/    ← List, Detail, Form, Barcode
│   ├── categories/  ← Tree view
│   ├── warehouses/  ← List, Detail
│   ├── stock-movements/ ← List, Create
│   ├── suppliers/   ← List, Detail
│   ├── purchase-orders/ ← List, Detail, Receive
│   └── export/      ← CSV/PDF export
├── store/           ← Zustand auth store
├── types/           ← TypeScript interfaces
├── lib/             ← Utils
└── main.tsx         ← Entry point
```

## UX Design

### User Journey

1. **Login** → User authenticates (Admin/Warehouse Manager/Staff)
2. **Dashboard** → Overview of inventory value, low-stock alerts, movements chart
3. **Products** → Search by SKU/name, filter by category, view details
4. **Stock Movement** → Create in/out/transfer/adjustment
5. **Purchase Order** → Create PO to supplier → send → receive → auto stock in
6. **Export** → CSV products/stock/movements, PDF barcode labels

### Color Palette

| Color | Hex | Usage |
|---|---|---|
| Orange 700 | #C2410C | Sidebar, headers |
| Orange 600 | #EA580C | Primary buttons, links |
| Orange 500 | #F97316 | Accents, badges |
| Slate 900 | #0F172A | Dark backgrounds |
| Slate 800 | #1E293B | Cards, sections |
| Slate 700 | #334155 | Borders, dividers |
| Gray 300 | #D1D5DB | Light borders |
| Gray 100 | #F3F4F6 | Light backgrounds |

### Typography

- **Headings:** Inter (sans-serif) — industrial aesthetic
- **Body:** Inter (sans-serif) — clean readability
- **Sizes:** 2xl (titles), lg (sections), base (body), sm (meta)

### Components

- **Button:** variants (primary, secondary, danger), sizes (sm, md), loading state
- **Input:** with label, error display, icon support
- **Card:** container with shadow, hover animation
- **Badge:** status-based colors (in stock, low stock, out of stock, draft, sent, received)
- **Table:** compact rows, sortable columns, pagination
- **Sidebar:** navigation with role-based filtering, user info, logout

### Animations (Framer Motion)

- **Page transitions:** fade + slide (300-500ms)
- **Product card hover:** scale + shadow lift
- **Stock movement animations:** number count-up for quantity changes
- **Barcode reveal:** fade-in + scale on generation
- **List staggered:** table rows appear with stagger delay
- **Button micro-interactions:** hover scale, tap shrink, loading spinner
- **Skeleton shimmer:** loading placeholders
- **Dashboard scroll reveal:** widgets fade in on scroll
- **Number counters:** animated dashboard metrics
- **Low-stock alert pulse:** pulsing red badge for items below minimum

### Responsive Breakpoints

- **Mobile:** 320-768px — single column, collapsible sidebar
- **Tablet:** 768-1024px — two column grids
- **Desktop:** 1024px+ — full sidebar, multi-column layouts

### States

- **Empty:** illustration + CTA when no data
- **Loading:** skeleton shimmer placeholders
- **Error:** friendly message + retry action (ErrorState component with onRetry)

### Wireframes

#### Login Page
```
┌──────────────────────────────────────────┐
│         Inventory Management             │
│              System                      │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │  Email                             │  │
│  │  [______________________________]  │  │
│  │  Password                          │  │
│  │  [______________________________]  │  │
│  │  [      Sign In (Orange)      ]   │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

#### Dashboard
```
┌──────────────────────────────────────────────────────────────┐
│  [Sidebar]    │  Dashboard                                    │
│  ─────────    │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐         │
│  📊 Dashboard │  │Total │ │Ware- │ │Suppl-│ │Stock │         │
│  📦 Products  │  │Prod. │ │houses│ │iers  │ │Moves │         │
│  📂 Categories│  └──────┘ └──────┘ └──────┘ └──────┘         │
│  🏭 Warehouses│  ┌────────────────┐ ┌────────────────┐      │
│  🔄 Stock Mov.│  │ Low Stock      │ │ Recent Moves   │      │
│  🚚 Suppliers │  │ ⚠ Product A    │ │ ↑ Product A IN │      │
│  📋 Purchase  │  │ ⚠ Product B    │ │ ↓ Product B OUT│      │
│     Orders    │  └────────────────┘ └────────────────┘      │
│  ─────────    │  ┌─────────────────────────────────────┐    │
│  👤 User      │  │ Inventory Trends (Last 30 Days)     │    │
│     Logout    │  │ Date    IN    OUT                   │    │
│               │  │ 03/01   120   45                    │    │
│               │  └─────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
```

#### Products List
```
┌──────────────────────────────────────────────────────────────┐
│  Products                          [+ Add Product]           │
│  [🔍 Search products...]                                     │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ SKU    │ Name        │ Category │ Stock │ Price │ Actions│
│  │ SK-001 │ Widget A    │ Tools    │  150  │ $9.99 │ ✏ 🗑  │
│  │ SK-002 │ Widget B    │ Tools    │   12  │ $14.99│ ✏ 🗑  │
│  │ SK-003 │ Gadget C    │ Elec.    │   0   │ $29.99│ ✏ 🗑  │
│  └──────────────────────────────────────────────────────┘   │
│              [< Prev]  Page 1 of 5  [Next >]                │
└──────────────────────────────────────────────────────────────┘
```

#### Product Detail
```
┌──────────────────────────────────────────────────────────────┐
│  ← Back to Products                                          │
│  ┌──────────┐  Widget A (Inter bold)                         │
│  │          │  SKU: SK-001 | Category: Tools                 │
│  │  Product │  Price: $9.99 | Stock: 150                     │
│  │  Image   │  Min Stock: 20 | Description...                │
│  │          │  [Edit Product]  [Delete]                      │
│  └──────────┘                                               │
│                                                              │
│  Stock by Warehouse:                                         │
│  ┌──────────────────────────────────────────────────┐       │
│  │ Warehouse    │ Stock │ Min Stock │ Status         │       │
│  │ Warehouse A  │  100  │   20     │ ✅ In Stock    │       │
│  │ Warehouse B  │   50  │   20     │ ✅ In Stock    │       │
│  └──────────────────────────────────────────────────┘       │
└──────────────────────────────────────────────────────────────┘
```

#### Purchase Orders
```
┌──────────────────────────────────────────────────────────────┐
│  Purchase Orders                    [+ Create Order]         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ PO #   │ Supplier    │ Status  │ Total   │ Actions     │   │
│  │ PO-001 │ Acme Corp   │ DRAFT   │ $1,200  │ [Send]      │   │
│  │ PO-002 │ Beta Inc    │ SENT    │ $3,500  │ [Receive]   │   │
│  │ PO-003 │ Gamma LLC   │ RECEIVED│ $890    │ —           │   │
│  └──────────────────────────────────────────────────────┘   │
│              [< Prev]  Page 1 of 3  [Next >]                │
└──────────────────────────────────────────────────────────────┘
```

#### Stock Movements
```
┌──────────────────────────────────────────────────────────────┐
│  Stock Movements                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Type  │ Product    │ Qty │ Warehouse │ Date    │ Notes  │   │
│  │ IN    │ Widget A   │ 50  │ Wh-A      │ 03/01   │ PO-002 │   │
│  │ OUT   │ Widget B   │ 12  │ Wh-B      │ 03/01   │ Order  │   │
│  │ TRANS │ Widget A   │ 20  │ A→B       │ 02/28   │ —      │   │
│  │ ADJ   │ Gadget C   │ -5  │ Wh-A      │ 02/27   │ Audit  │   │
│  └──────────────────────────────────────────────────────┘   │
│              [< Prev]  Page 1 of 8  [Next >]                │
└──────────────────────────────────────────────────────────────┘
```

### Interactive Elements

- **Search bar:** Real-time product/supplier filtering with debounced input
- **Pagination controls:** Prev/Next buttons with page indicator; disabled at boundaries
- **Product card hover:** Framer Motion scale + shadow lift on hover
- **Delete product:** Button with toast confirmation; auto-refreshes product list
- **Category tree:** Expandable/collapsible nested tree with animated reveal
- **Send purchase order:** One-click action button; changes status from DRAFT to SENT
- **Receive purchase order:** Action button that triggers auto stock-in movement
- **Stock movement type icons:** Color-coded icons (IN=green, OUT=red, TRANSFER=blue, ADJUSTMENT=orange)
- **Low stock alerts:** Pulsing red badge for products below minimum stock threshold
- **Dashboard stat cards:** Animated number counters on mount; staggered appearance
- **Inventory trends:** Visual list with trend icons showing in/out quantities per day
- **Add Product/Supplier/Warehouse buttons:** Open form modals for creation
- **Toast notifications:** Success/error feedback for all mutations (create, delete, send, receive)
- **Role-based UI:** Admin sees all actions; Staff sees limited views
- **Barcode display:** Product detail shows barcode with fade-in animation
- **Responsive sidebar:** Collapsible on mobile; full navigation on desktop

## Design Decisions

### Repository Pattern for All Modules
All service modules (products, categories, warehouses, stock-movements, suppliers, purchase-orders, dashboard, export) delegate database operations to dedicated repository classes. The `StockMovementRepository` uses an interactive `$transaction` to atomically create the movement record and update `StockLevel` quantities. The `PurchaseOrderRepository.receive()` method uses `Promise.all` within a transaction to avoid N+1 queries when creating stock movements and updating stock levels for all line items.

### AccessToken in Memory (Zustand)
The frontend stores `accessToken` in Zustand state (memory) rather than `localStorage`. On page reload, `App.tsx` calls `/auth/refresh` using the httpOnly cookie to obtain a new access token and fetches user data via `/auth/me`, restoring the session without exposing the token to XSS.

### useLogout with QueryClient.clear()
The `useLogout` hook clears the React Query cache after logout to prevent stale data from being visible to the next user session. Layout.tsx delegates logout to this hook.

### Rate Limiting on Logout
The `/auth/logout` route is protected by both `authenticate` middleware and `authLimiter` to prevent abuse.

### CSV Injection Protection
The `escapeCsvField` function in export service prefixes cell values starting with `=`, `+`, `-`, or `@` with a single quote to prevent CSV injection attacks when opened in spreadsheet applications.

### Standard Handler Pattern (No Spread Operator)
Auth and export controllers use standard exported handler functions wrapped in `asyncHandler` instead of the spread operator array pattern (`...controller.method`). Validation middleware (`validateBody`) is applied explicitly in route definitions, improving readability and type safety.

### Refresh Token Expiry in Milliseconds
The `env.jwt.refreshExpiresInMs` value is pre-computed at startup as `optionalInt('JWT_REFRESH_EXPIRES_IN', 7) * 24 * 60 * 60 * 1000`. This avoids fragile `parseInt` on string values at runtime and provides a consistent millisecond value for both cookie `maxAge` and refresh token `expiresAt`.
