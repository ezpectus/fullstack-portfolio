# Architecture — E-commerce Admin Panel

## Table of Contents

- [System Overview](#system-overview)
- [Tech Stack](#tech-stack)
- [Design System](#design-system)

## System Overview

Admin panel for e-commerce store management. No storefront — purely management interface for products, orders, customers, promo codes, and analytics.

## Tech Stack

- **Backend**: Node.js 20+, Express 4, TypeScript 5, Prisma 5, PostgreSQL 16, Redis 7
- **Frontend**: React 18, Vite 5, TailwindCSS 3, React Query 5, Zustand 4, Framer Motion, Recharts
- **Auth**: JWT (access + refresh tokens), bcrypt password hashing
- **Images**: Multer upload + Sharp processing

## Design System

### Color Palette — Vibrant E-commerce

| Token | Light | Dark | Usage |
|---|---|---|---|
| `primary` | `#6366f1` (indigo-500) | `#818cf8` (indigo-400) | Primary actions, active nav |
| `primary-dark` | `#4f46e5` (indigo-600) | `#6366f1` | Hover states |
| `accent` | `#f59e0b` (amber-500) | `#fbbf24` (amber-400) | Highlights, badges, alerts |
| `success` | `#10b981` (emerald-500) | `#34d399` | Completed orders, in-stock |
| `warning` | `#f59e0b` (amber-500) | `#fbbf24` | Pending, low stock |
| `danger` | `#ef4444` (red-500) | `#f87171` | Cancelled, errors |
| `info` | `#3b82f6` (blue-500) | `#60a5fa` | Processing, info badges |
| `bg` | `#f8fafc` (slate-50) | `#0f172a` (slate-900) | Page background |
| `surface` | `#ffffff` | `#1e293b` (slate-800) | Cards, modals |
| `text` | `#1e293b` (slate-800) | `#e2e8f0` (slate-200) | Body text |
| `text-muted` | `#64748b` (slate-500) | `#94a3b8` (slate-400) | Secondary text |
| `border` | `#e2e8f0` (slate-200) | `#334155` (slate-700) | Borders, dividers |

### Typography

- **Font Family**: `Inter`, system-ui, sans-serif
- **Headings**: 600-700 weight, tight tracking
- **Body**: 400 weight, 0.25px tracking
- **Numbers/Metrics**: `tabular-nums` for alignment

### Spacing & Layout

- Sidebar: 240px fixed, collapsible to 64px
- Content max-width: 1400px
- Card padding: 24px
- Table row height: 56px
- Gap between cards: 24px

## User Journey

### 1. Authentication

```
Login Page → Enter credentials → JWT tokens stored → Redirect to Dashboard
```

- Login form with email + password
- "Remember me" extends refresh token to 30d
- Failed login shows error toast with shake animation
- Successful login: fade transition to dashboard

### 2. Dashboard

```
Dashboard → Overview stats (revenue, orders, customers, AOV) → Recent orders table → Revenue chart → Top products
```

- Stat cards with animated number counters (count up on mount)
- Revenue chart with Recharts area chart
- Recent orders table with status badges
- Scroll reveal for lower sections

### 3. Product Management

```
Products List → Search/Filter → Create/Edit Product → Variants tab → Images tab → SEO tab → Save
```

- List: sortable table with thumbnail, name, SKU, price, stock, status
- Create/Edit: tabbed form (General, Variants, Images, SEO)
- Variants: dynamic add/remove rows (size, color, material, price delta, SKU, stock)
- Images: drag-and-drop upload with preview, reorder via drag
- Bulk actions: CSV import, CSV export, bulk delete
- Delete: confirmation modal with scale+fade animation

### 4. Order Management

```
Orders List → Filter by status → Order Detail → Update status → Generate packing slip PDF
```

- List: filterable by status (pending/processing/shipped/delivered/cancelled/refunded)
- Detail: customer info, items table, shipping address, status timeline
- Status change: dropdown with confirmation for terminal states
- Packing slip: PDF generation button

### 5. Customer Management

```
Customers List → Search/Filter → Customer Detail → Order history → Segmentation tag
```

- List: name, email, total orders, total spend, segment badge
- Detail: profile + order history + lifetime value
- Segments: VIP (>$1000 spend), Regular, New (first order <30d)

### 6. Promo Codes

```
Promo Codes List → Create Promo → Configure (type, value, limits, expiry) → Save
```

- List: code, type, value, usage count, expiry, status
- Create: percentage or fixed, min order value, max uses, expiry date, product/category binding

### 7. Analytics

```
Analytics → Date range selector → Revenue chart → Top products → Top categories → AOV → Refund rate
```

- Date range picker (7d, 30d, 90d, custom)
- Recharts: area for revenue, bar for top products, pie for categories
- Animated chart transitions on data change

### 8. Settings

```
Settings → Store config tab → Taxes tab → Shipping tab → Currency tab → Save
```

- Store: name, description, logo, contact
- Taxes: tax class + rate per region
- Shipping: methods with rates
- Currency: base currency, supported currencies, exchange rates

## Wireframes

### Dashboard

```
┌─────────────────────────────────────────────────┐
│ [Sidebar] │  Dashboard                    [👤]  │
│           │                                       │
│  📊 Dash  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐│
│  📦 Prod  │  │Revenue│ │Orders│ │Cust. │ │ AOV  ││
│  📦 Order │  │$12.5k │ │  142 │ │  89  │ │ $87  ││
│  👥 Cust  │  └──────┘ └──────┘ └──────┘ └──────┘│
│  🏷️ Promo │                                       │
│  📈 Anal  │  ┌──────────────────────────────────┐│
│  ⚙️ Sett  │  │     Revenue Chart (Area)         ││
│           │  │                                  ││
│           │  └──────────────────────────────────┘│
│           │                                       │
│           │  ┌──────────────────────────────────┐│
│           │  │  Recent Orders                   ││
│           │  │  #ORD-001  $129  Processing  →   ││
│           │  │  #ORD-002  $89   Delivered   →   ││
│           │  └──────────────────────────────────┘│
└─────────────────────────────────────────────────┘
```

### Product Edit (Tabbed)

```
┌─────────────────────────────────────────────────┐
│ [Sidebar] │  Edit Product: "T-Shirt Pro"        │
│           │                                       │
│           │  [General] [Variants] [Images] [SEO] │
│           │  ┌──────────────────────────────────┐│
│           │  │  Name: [T-Shirt Pro         ]   ││
│           │  │  SKU:  [TSP-001            ]    ││
│           │  │  Price: [$29.99    ] Stock:[150]││
│           │  │  Category: [Apparel      ▼]     ││
│           │  │  Description:                    ││
│           │  │  [textarea                     ] ││
│           │  │  Status: ( ) Active ( ) Draft   ││
│           │  └──────────────────────────────────┘│
│           │  [Cancel]              [Save Product]│
└─────────────────────────────────────────────────┘
```

## Interactive Elements

### Framer Motion Animations

| Element | Animation |
|---|---|
| Page transitions | Fade + slide (0.3s ease) |
| Dashboard stat cards | Number count-up on mount |
| List items | Staggered fade-in (50ms delay each) |
| Modals | Scale 0.95→1 + fade (0.2s) |
| Buttons | Tap: scale 0.97, hover: scale 1.02 |
| Toasts | Slide in from right + fade out |
| Skeleton loaders | Shimmer pulse (1.5s infinite) |
| Table rows | Hover: background fade, click: ripple |
| Drag-and-drop images | Scale 1.05 + shadow on drag |
| Charts | Path draw animation on data change |
| Sidebar collapse | Width transition (0.3s ease) |
| Delete confirmation | Shake on invalid, scale+fade on confirm |
| Order status badge | Color transition on status change |
| Scroll reveal | Fade + translateY 20px on viewport enter |

## API Endpoints

```
POST   /auth/register          — Register new user
POST   /auth/login             — Login
POST   /auth/refresh           — Refresh access token
POST   /auth/logout            — Logout
GET    /auth/me                — Current user

GET    /users                  — List users (admin)
POST   /users                  — Create user (admin)
GET    /users/:id              — Get user
PUT    /users/:id              — Update user
DELETE /users/:id              — Delete user (admin)

GET    /products               — List products (paginated, searchable)
POST   /products               — Create product
GET    /products/:id           — Get product detail
PUT    /products/:id           — Update product
DELETE /products/:id           — Delete product
POST   /products/:id/images    — Upload product images
POST   /products/bulk-import   — CSV import
GET    /products/bulk-export   — CSV export

GET    /categories             — List categories (tree)
POST   /categories             — Create category
PUT    /categories/:id         — Update category
DELETE /categories/:id         — Delete category

GET    /orders                 — List orders (filterable)
POST   /orders                 — Create order
GET    /orders/:id             — Get order detail
PUT    /orders/:id/status      — Update order status
GET    /orders/:id/packing-slip — Download packing slip PDF

GET    /customers              — List customers (paginated, searchable)
GET    /customers/:id          — Get customer detail
PUT    /customers/:id          — Update customer
GET    /customers/:id/orders   — Customer order history

GET    /promo-codes            — List promo codes
POST   /promo-codes            — Create promo code
PUT    /promo-codes/:id        — Update promo code
DELETE /promo-codes/:id        — Delete promo code

GET    /analytics/revenue      — Revenue analytics
GET    /analytics/top-products — Top selling products
GET    /analytics/top-categories — Top categories
GET    /analytics/summary      — AOV, refund rate, etc.

GET    /settings               — Get store settings
PUT    /settings               — Update store settings
```

## Database Schema (ER Overview)

```
User (super_admin/manager/staff)
  └── RefreshToken

Category (self-referencing parent → children tree)

Product
  ├── ProductVariant (size, color, material, SKU, price, stock)
  ├── ProductImage (url, alt, position)
  └── Category (many-to-one)

Customer
  └── Address (shipping/billing)

Order
  ├── Customer (many-to-one)
  ├── OrderItem (ProductVariant, qty, price)
  └── Address (shipping)

PromoCode
  ├── type: percentage | fixed
  ├── minOrderValue, maxUses, usedCount
  ├── expiresAt
  └── Product/Category binding (optional)

Settings (singleton: store config, taxes, shipping, currency)
```

## Security

- JWT access (15m) + refresh (7d) tokens
- bcrypt password hashing (10 rounds)
- RBAC middleware: super_admin, manager, staff
- Rate limiting: 100 req/15min general, 5 req/15min auth
- Helmet for security headers
- CORS configured for frontend origin
- Zod validation on all inputs
- SQL injection prevention via Prisma parameterized queries

## Design Decisions

### Opaque Refresh Tokens (v1.0.1)

Refresh tokens use `crypto.randomBytes(40)` instead of `jwt.sign` — tokens are opaque and can only be validated via database lookup, preventing information leakage and enabling server-side revocation.

### Error Hierarchy (v1.0.1)

All error classes extend `AppError` base class with `Object.setPrototypeOf` for correct prototype chain in TypeScript. Middleware uses `next(new SpecificError())` pattern instead of `res.status().json()`.

### Environment Safety (v1.0.1)

JWT secrets use `required()` without fallback. `parseDuration()` converts human-readable durations (`7d`, `15m`) to milliseconds. Rate limiter applied globally before routes. Static file serving protected by `authenticate` middleware. 404 catch-all route added before error handler.

### Register Role Restriction (v1.0.1)

`role` removed from register input — self-registration assigns a default role. Privileged roles can only be assigned via admin invite flow, preventing privilege escalation.
