# Architecture — Library Management System

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)

## Overview

A full-stack library management system for managing books, members, loans, reservations, and fines. Built with Node.js/Express backend and React/Vite frontend.

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
│   ├── books/       ← CRUD books, search
│   ├── book-copies/ ← CRUD physical copies, status
│   ├── members/     ← CRUD members, library cards
│   ├── loans/       ← issue, return, renew, overdue
│   ├── reservations/← reserve, cancel, queue
│   ├── fines/       ← calculate, pay, waive
│   ├── dashboard/   ← aggregated stats
│   └── reports/     ← activity, popular genres, export
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
│   ├── dashboard/   ← Stats, charts
│   ├── books/       ← List, Detail, Form
│   ├── book-copies/ ← Copies management
│   ├── members/     ← List, Detail
│   ├── loans/       ← List, return, renew
│   ├── reservations/← List, cancel
│   ├── fines/       ← List, pay, waive
│   └── reports/     ← Analytics, export
├── store/           ← Zustand auth store
├── types/           ← TypeScript interfaces
├── lib/             ← Utils (formatDate, formatCurrency)
└── main.tsx         ← Entry point
```

## UX Design

### User Journey

1. **Login/Register** → User authenticates (Admin/Librarian or Member)
2. **Dashboard** → Overview of books, active loans, overdue, fines
3. **Search Books** → Full-text search by title, author, ISBN
4. **Book Detail** → View copies, availability, reserve
5. **Issue Book** → Select copy + member → create loan
6. **Return Book** → Mark loan as returned → calculate fine if overdue
7. **View Fines** → Pay or waive fines
8. **Reports** → Member activity, popular genres, export CSV

### Color Palette

| Color | Hex | Usage |
|---|---|---|
| Amber 800 | #92400E | Sidebar, headers |
| Amber 600 | #D97706 | Primary buttons, links |
| Amber 500 | #F59E0B | Accents, badges |
| Cream 50 | #FFFBEB | Background |
| Cream 100 | #FEF3C7 | Cards, sections |
| Cream 200 | #FDE68A | Borders, dividers |
| Gray 800 | #1F2937 | Text |
| Gray 500 | #6B7280 | Secondary text |

### Typography

- **Headings:** Lora (serif) — book-like aesthetic
- **Body:** Inter (sans-serif) — clean readability
- **Sizes:** 2xl (titles), lg (sections), base (body), sm (meta)

### Components

- **Button:** variants (primary, secondary, danger), sizes (sm, md), loading state
- **Input:** with label, error display, icon support
- **Card:** container with shadow, hover animation
- **Badge:** status-based colors (available, borrowed, overdue, etc.)
- **Sidebar:** navigation with role-based filtering, user info, logout

### Animations (Framer Motion)

- **Page transitions:** fade + slide (300-500ms)
- **List staggered:** cards/rows appear with stagger delay
- **Button micro-interactions:** hover scale, tap shrink, loading spinner
- **Skeleton shimmer:** loading placeholders
- **Number counters:** animated dashboard metrics
- **Scroll reveal:** dashboard widgets fade in on scroll
- **Modal scale+fade:** dialogs and confirmations

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
│              Library Logo                │
│         Library Management System        │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │  Email                             │  │
│  │  [______________________________]  │  │
│  │  Password                          │  │
│  │  [______________________________]  │
│  │  [       Sign In (Amber)      ]   │  │
│  │  Don't have an account? Register   │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

#### Dashboard
```
┌──────────────────────────────────────────────────────────────┐
│  [Sidebar]    │  Dashboard                                    │
│  ─────────    │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐         │
│  📊 Dashboard │  │Total │ │Active│ │Active│ │Overdue│        │
│  📚 Books     │  │Books │ │Members│ │Loans │ │Loans │        │
│  📖 Loans     │  └──────┘ └──────┘ └──────┘ └──────┘         │
│  👥 Members   │  ┌────────────────┐ ┌────────────────┐      │
│  🔖 Reserv.   │  │ Loans by Month │ │ Popular Books  │      │
│  💰 Fines     │  │   [Bar Chart]  │ │   1. Title A   │      │
│  📊 Reports   │  │                │ │   2. Title B   │      │
│  ─────────    │  └────────────────┘ └────────────────┘      │
│  👤 User      │  ┌─────────────────────────────────────┐    │
│     Logout    │  │ Outstanding Fines: $XX.XX           │    │
│               │  └─────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
```

#### Book List
```
┌──────────────────────────────────────────────────────────────┐
│  Books                              [+ Add Book (Admin)]     │
│  [🔍 Search by title, author, or ISBN...]                    │
│                                                              │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│  │ [Cover] │ │ [Cover] │ │ [Cover] │ │ [Cover] │           │
│  │ Title   │ │ Title   │ │ Title   │ │ Title   │           │
│  │ Author  │ │ Author  │ │ Author  │ │ Author  │           │
│  │ Genre   │ │ Genre   │ │ Genre   │ │ Genre   │           │
│  │ N copies│ │ N copies│ │ N copies│ │ N copies│           │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘           │
│                                                              │
│              [< Prev]  Page 1 of 5  [Next >]                │
└──────────────────────────────────────────────────────────────┘
```

#### Book Detail
```
┌──────────────────────────────────────────────────────────────┐
│  ← Back to Books                                             │
│  ┌──────────┐  Title (Lora serif)                            │
│  │          │  Author(s)                                     │
│  │  Cover   │  ISBN: xxx | Published: YYYY                   │
│  │  Image   │  Genre: Fiction | Pages: 350                   │
│  │          │  Description...                                │
│  └──────────┘  [Reserve Book]  [Edit] [Delete (Admin)]       │
│                                                              │
│  Copies:                                                     │
│  ┌──────────────────────────────────────────────────┐       │
│  │ Code    │ Status    │ Condition  │ Actions       │       │
│  │ BK-001  │ Available │ Good      │ [Issue Loan]  │       │
│  │ BK-002  │ Borrowed  │ Fair      │ —             │       │
│  └──────────────────────────────────────────────────┘       │
└──────────────────────────────────────────────────────────────┘
```

#### Loan List
```
┌──────────────────────────────────────────────────────────────┐
│  Loans                              [Status: All ▾]          │
│  ┌──────────────────────────────────────────────────┐       │
│  │ Book        │ Member    │ Due Date  │ Status │ Actions   │
│  │ Title A     │ John Doe  │ 2024-03-01│ Active │ [Return]  │
│  │             │           │           │        │ [Renew]   │
│  │ Title B     │ Jane S.   │ 2024-02-15│ Overdue│ [Return]  │
│  └──────────────────────────────────────────────────┘       │
│              [< Prev]  Page 1 of 3  [Next >]                │
└──────────────────────────────────────────────────────────────┘
```

#### Member Detail
```
┌──────────────────────────────────────────────────────────────┐
│  ← Back to Members                                           │
│  ┌────────────┐  John Doe                                    │
│  │  [Avatar]  │  john@example.com | +1 555-0100              │
│  │   JD       │  Member since: 2023-01-15                    │
│  │            │  Status: Active | Card: LIB-001              │
│  └────────────┘                                              │
│                                                              │
│  Active Loans (2)          │ Outstanding Fines               │
│  ┌──────────────────┐      │  ┌──────────────────┐          │
│  │ Title A - Due 3/1│      │  │ $15.00 Overdue   │          │
│  │ Title B - Due 2/15│     │  │ [Pay] [Waive]    │          │
│  └──────────────────┘      │  └──────────────────┘          │
└──────────────────────────────────────────────────────────────┘
```

### Interactive Elements

- **Search bar:** Real-time filtering with debounced input; clears on page change
- **Status dropdown filters:** Filter loans/fines/reservations by status with instant list update
- **Pagination controls:** Prev/Next buttons with page indicator; disabled at boundaries
- **Reserve button:** One-click reservation on Book Detail; shows toast confirmation
- **Return/Renew buttons:** Action buttons on loan rows with loading state during mutation
- **Pay/Waive fine:** Action buttons with confirmation; auto-refreshes fine list
- **Cancel reservation:** Button with confirmation dialog; invalidates query cache
- **Add Book form:** Multi-field form (title, author, ISBN, genre, description, cover URL) with validation
- **Add Book Copy:** Inline form toggle with book ID, code, and condition fields
- **Export CSV:** Downloads loans report as CSV file; triggers browser download
- **Dashboard charts:** Interactive bar chart (loans by month) and popular books list with hover tooltips
- **Reports charts:** Pie chart (popular genres) and bar chart (lost/damaged) with color-coded legend
- **Role-based UI:** Admin/Librarian sees management actions; Members see browse-only views
- **Toast notifications:** Success/error feedback for all mutations (create, update, delete, pay, waive)
- **Animated number counters:** Dashboard stats animate from 0 to value on mount
- **Staggered card animations:** Book cards and list items appear with sequential delay
- **Skeleton shimmer:** Loading placeholders match content layout during data fetch

## Design Decisions

### LoansRepository Transaction Methods
The `LoansRepository` exposes `createTx`, `updateTx`, `updateBookCopyStatusTx`, and `createFineTx` methods that return `PrismaPromise` objects (not awaited). These are composed into `loansRepository.transaction()` calls in the service layer, ensuring all Prisma access goes through the repository pattern — even inside transactions.

### AccessToken in Memory
The frontend stores `accessToken` in Zustand state (memory) rather than localStorage. Only the `user` object is persisted to localStorage for auth restoration on reload. The API client interceptor reads the token from Zustand state and handles 401 with a concurrent refresh queue.

### useLogout with QueryClient.clear()
The `useLogout` hook clears the React Query cache after logout to prevent stale data from being visible to the next user session.

### Loan.librarianId Optional with onDelete: SetNull
The `librarianId` field on `Loan` is optional (`String?`) with `onDelete: SetNull`. This ensures that deleting a librarian user doesn't cascade-delete loan records — the librarian reference is simply cleared.

### Rate Limiting on All Auth Endpoints
All authentication endpoints (`/register`, `/login`, `/refresh`, `/logout`) are protected by `authLimiter` to prevent brute-force attacks. The `/logout` endpoint also requires `authenticate` middleware.

### CSV Injection Protection
The `exportCsv` method in reports service prefixes cell values starting with `=`, `+`, `-`, or `@` with a single quote to prevent CSV injection attacks when opened in spreadsheet applications.
