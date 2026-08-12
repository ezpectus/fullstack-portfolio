# Architecture — URL Shortener

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)

## Overview

A URL shortener service with analytics, QR codes, REST API, and dashboard. Built with Node.js + Express + TypeScript backend and React + Vite + TailwindCSS frontend.

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js 20+, Express 4, TypeScript 5 |
| ORM | Prisma 5 |
| Database | PostgreSQL 16 |
| Cache | Redis 7 (redirect cache, click counters) |
| Frontend | React 18, Vite 5, TailwindCSS 3 |
| UI Components | Custom shadcn/ui-style components |
| Animations | Framer Motion |
| State (server) | TanStack React Query 5 |
| State (client) | Zustand 4 |
| Routing | React Router 6 |
| Forms | React Hook Form + Zod |
| Validation | Zod (shared frontend/backend) |
| Auth | JWT (access + refresh), bcrypt |
| Testing | Vitest + Supertest |
| QR | qrcode |
| Charts | Recharts |

## Architecture

### Backend — Clean Architecture

```
backend/src/
├── config/          # Database, Redis, Environment
├── middleware/      # Auth, RBAC, Error handling, Rate limiting, Validation
├── modules/         # Feature-based modules
│   ├── auth/        # Controller, Service, Repository, Routes, DTO
│   ├── users/
│   ├── links/
│   ├── redirect/    # Public redirect endpoint with Redis cache
│   ├── qr/          # QR code generation (PNG/SVG)
│   ├── analytics/   # Click statistics
│   ├── api-keys/    # API key CRUD
│   ├── dashboard/   # Overview stats
│   └── settings/    # User settings
├── shared/          # Errors, types, utils
└── app.ts           # Express app setup
```

Each module follows: Controller → Service → Repository (3 layers max).
- **Controller**: HTTP request/response handling
- **Service**: Business logic
- **Repository**: Data access via Prisma

### Frontend Structure

```
frontend/src/
├── api/             # Axios client + React Query hooks
├── components/
│   ├── animations/  # Framer Motion components
│   ├── layout/      # Sidebar, topbar, outlet
│   └── ui/          # Button, Card, Input, Badge, Modal, Skeleton, EmptyState
├── pages/
│   ├── auth/        # Login, Register
│   ├── dashboard/   # Dashboard with stats and charts
│   ├── links/       # Links list + detail
│   ├── analytics/   # Analytics overview
│   ├── qr/          # QR code generator
│   ├── api-keys/    # API key management
│   └── settings/    # User settings
├── store/           # Zustand stores (auth, theme, toast)
├── lib/             # Utilities
├── types/           # TypeScript types
└── main.tsx         # App entry
```

## UX Design

### Design Palette

- **Primary**: Purple/Neon (`hsl(259, 94%, 61%)`) — vibrant, tech-forward
- **Background**: Dark-first (`hsl(240, 10%, 3.9%)`) with glassmorphism
- **Accent**: Purple glow with neon shadows
- **Typography**: Poppins (300-800 weights) — modern, geometric
- **Visual style**: Glassmorphism cards, neon borders, gradient buttons
- **Dark mode**: Default dark, toggle to light

### User Journey

1. **Login/Register** → Glassmorphism auth card with gradient logo
2. **Dashboard** → Animated counters for stats, line chart for clicks, top/recent links
3. **Create Link** → Modal with URL input + optional custom alias
4. **Links List** → Staggered card list with search, status filter, pagination
5. **Link Detail** → Edit alias/status, view click count, copy/open/delete actions
6. **Analytics** → Charts: line (clicks over time), bar (countries), pie (devices), bar (browsers)
7. **QR Codes** → Select a link → QR code appears → Download PNG
8. **API Keys** → Create named keys, copy, revoke
9. **Settings** → Domain, code length, blacklist

### Wireframes

#### Dashboard
```
┌─────────────────────────────────────────┐
│  Sidebar  │  Dashboard                   │
│  - Dash   │  ┌──────┐ ┌──────┐ ┌──────┐ │
│  - Links  │  │Total │ │Active│ │Clicks│ │
│  - Analyt │  │Links │ │Links │ │      │ │
│  - QR     │  └──────┘ └──────┘ └──────┘ │
│  - Keys   │  ┌────────────────────────┐ │
│  - Setts  │  │  Clicks (30 days)      │ │
│           │  │  ~~~~/~~~/~~~~~~       │ │
│           │  └────────────────────────┘ │
│           │  ┌─────────┐ ┌─────────┐   │
│           │  │Top Links│ │Recent   │   │
│           │  └─────────┘ └─────────┘   │
└─────────────────────────────────────────┘
```

#### Links List
```
┌─────────────────────────────────────────┐
│  Links                    [+ Create]    │
│  [Search...]  [Status: All ▼]          │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ abc123  → example.com  Active   │   │
│  │ 42 clicks  [copy] [open] [del]  │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ my-link → longurl.com  Active   │   │
│  └─────────────────────────────────┘   │
│                                         │
│  [Prev]  Page 1 of 3  [Next]          │
└─────────────────────────────────────────┘
```

### Interactive Elements

- **Page transitions**: Fade + slide (300ms)
- **List animations**: Staggered children (50ms delay each)
- **Modal animations**: Scale + fade (200ms)
- **Button micro-interactions**: Hover scale 1.02, tap scale 0.98
- **Toast notifications**: Slide-in from right, auto-dismiss 4s
- **Skeleton shimmer**: Pulsing opacity for loading states
- **Scroll reveal**: Dashboard widgets fade-in on scroll
- **Animated counters**: Spring-based number count-up
- **QR code reveal**: QR appears with scale animation when link selected
- **prefers-reduced-motion**: All animations disabled, content shown immediately

### Responsive Breakpoints

- **Mobile** (320-768px): Single column, sidebar collapses
- **Tablet** (768-1024px): Two-column grids
- **Desktop** (1024px+): Full sidebar + multi-column layout

### Loading States

- Skeleton shimmer for cards, lists, and page sections
- Animated counters for dashboard metrics
- Spinner text on buttons during mutations

### Error States

- ErrorState component with retry action
- Toast notifications for API errors
- 401 auto-logout with redirect to login

### Empty States

- EmptyState component with icon, title, description, and CTA
- "No links yet" / "No API keys yet" messages

## Design Decisions

### API Key Hashing (v1.0.1)

API keys are hashed via SHA-256 before storage — plaintext keys are never persisted. On creation, the plaintext key is returned once; on list, only masked keys are shown. `findByKey` hashes the input before lookup.

### Service-Repository Separation (v1.0.1)

`links.service` refactored to class-based `LinksService`. Direct Prisma access removed from services — `getSettings` added to `links.repository`. `redirect.routes` extracted to `redirect.service` + `redirect.repository` for proper separation of concerns. `api-keys.routes` now uses `apiKeysService` instead of direct Prisma calls.

### Role Constants (v1.0.1)

`shared/constants.ts` with `ROLES` constant introduced. `requireAdmin` middleware uses the constant instead of a hardcoded string, ensuring consistency across the codebase.

### Typed Update Input (v1.0.1)

`links.service.update` now accepts `UpdateLinkInput` (Zod-inferred type) instead of `Record<string, unknown>`, providing compile-time safety on update payloads.
