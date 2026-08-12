# Architecture — HR Portal

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture Pattern](#architecture-pattern)
- [Project Structure](#project-structure)
- [ER Diagram](#er-diagram)
- [Modules](#modules)
- [UX Design](#ux-design)

## Overview

HR Portal is a comprehensive human resources management system built with a modern full-stack architecture. It manages employees, departments, leave requests, payroll, documents, and provides analytics dashboards.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js 20+, Express 4, TypeScript 5 |
| ORM | Prisma 5 |
| Database | PostgreSQL 16 |
| Cache | Redis 7 |
| Frontend | React 18, Vite 5, TailwindCSS 3 |
| State (server) | TanStack React Query 5 |
| State (client) | Zustand 4 |
| Animations | Framer Motion |
| Charts | Recharts |
| PDF | pdfkit |
| Email | nodemailer |
| Auth | JWT (access + refresh), bcrypt, RBAC |

## Architecture Pattern

### Backend: Controller → Service → Repository

```
Route → Controller → Service → Repository → Prisma
         ↑ validate     ↑ business    ↑ data access
           (Zod)         logic           (Prisma Client)
```

- **Controller**: Handles HTTP request/response, calls service
- **Service**: Business logic, validation, orchestration
- **Repository**: Data access layer using Prisma ORM
- **DTO**: Zod schemas for request validation

### Frontend: Feature-based structure

```
src/
├── components/     ← Shared UI components
├── pages/          ← Route-level page components
├── store/          ← Zustand stores (auth, theme, toast)
├── hooks/          ← Custom hooks
├── lib/            ← API client, utilities
├── types/          ← TypeScript type definitions
├── App.tsx         ← Route definitions
└── main.tsx        ← Entry point
```

## ER Diagram

```
User (HR_ADMIN/MANAGER/EMPLOYEE) 1───* Employee *───* Department
                                              │
                                          LeaveRequest *───* LeaveType
                                              │
                                          Payslip
                                              │
                                          Document *───* DocumentType
```

## Modules

### Backend Modules

| Module | Description |
|--------|-------------|
| auth | JWT authentication (register, login, refresh, logout, me) |
| users | User CRUD, profile management |
| employees | Employee CRUD, org structure, profiles, position history |
| departments | Department CRUD, hierarchy, employee lists |
| leave | Leave request, approve/reject, balance, calendar |
| payroll | Payslips CRUD, approve, PDF generation, salary fund |
| documents | Document upload, generate from templates, download PDF |
| notifications | Email notifications for leave requests/approvals |
| dashboard | Overview stats, charts, birthdays, pending approvals |
| reports | Turnover, salary analysis, leave usage, CSV export |

## UX Design

### Design Palette

**Corporate Dark Blue with Accents**

| Token | Light | Dark |
|-------|-------|------|
| Primary | `#1e3a8a` (deep navy) | `#3b82f6` (bright blue) |
| Primary Dark | `#1e2d6b` | `#2563eb` |
| Primary Light | `#e0e7ff` | `#1e293b` |
| Accent | `#8b5cf6` (purple) | `#a78bfa` |
| Background | `#f1f5f9` (slate-100) | `#0f172a` (slate-900) |
| Surface | `#ffffff` | `#1e293b` (slate-800) |
| Text | `#1e293b` | `#e2e8f0` |
| Text Muted | `#64748b` | `#94a3b8` |
| Border | `#cbd5e1` | `#334155` |
| Success | `#16a34a` | `#22c55e` |
| Warning | `#d97706` | `#f59e0b` |
| Danger | `#dc2626` | `#ef4444` |

### Typography

- **Font Family**: Inter (300, 400, 500, 600, 700)
- **Headings**: 600-700 weight, tight letter-spacing
- **Body**: 400 weight, 0.25px letter-spacing
- **Monospace**: system-ui monospace for codes/IDs

### User Journey

1. **Login** → Enter credentials → JWT tokens stored → Redirect to Dashboard
2. **Dashboard** → View overview stats (total/active/on-leave, pending approvals, salary fund, birthdays)
3. **Employees** → Browse employee list → Search/filter → View detail (profile, org structure, history)
4. **Departments** → Browse departments → View hierarchy → See employee lists
5. **Leave Management** → Employee requests leave → Manager/HR approves/rejects → Balance auto-calculated → Email notification
6. **Payroll** → View payslips → Approve → Generate PDF → Salary fund chart
7. **Documents** → Upload PDF or generate from template → Link to employee → Download
8. **Reports** → View turnover, salary analysis, leave usage → Export CSV

### Wireframes

#### Login Page
- Centered card with logo
- Email + password fields
- "Sign in" button with loading state
- Demo account info below

#### Dashboard
- Top: 4 stat cards (Total Employees, Active, On Leave, Pending Approvals)
- Middle: Salary fund chart (bar) + Leave requests (list)
- Bottom: Birthdays this month + New hires this quarter

#### Employees List
- Search bar + department filter
- Table: Name, Position, Department, Status, Actions
- Pagination controls
- Empty state with CTA

#### Employee Detail
- Profile header (photo, name, position, department)
- Tabs: Info, Leave, Payroll, Documents
- Org structure tree (expand/collapse)

#### Leave Calendar
- Monthly calendar view
- Color-coded by leave type
- Click date to see who's on leave

#### Payslip View
- Salary breakdown (base, bonuses, deductions, total)
- Status badge (draft/approved/paid)
- Download PDF button

### Interactive Elements

- **Page transitions**: Fade + slide (Framer Motion)
- **List animations**: Staggered fade-in
- **Modal animations**: Scale + fade
- **Button micro-interactions**: Hover scale, tap shrink, loading spinner
- **Toast notifications**: Slide-in from right, auto-dismiss
- **Skeleton shimmer**: Loading placeholders
- **Scroll reveal**: Dashboard widgets animate on scroll
- **Number counters**: Animated counting for dashboard metrics
- **Org tree**: Expand/collapse with smooth height animation
- **Document generation**: Progress animation during PDF creation

### Responsive Design

- **Mobile (320-768px)**: Single column, collapsible sidebar, stacked cards
- **Tablet (768-1024px)**: Two-column layouts, visible sidebar
- **Desktop (1024px+)**: Full sidebar + multi-column dashboards

### Dark Mode

Full dark mode support with CSS variables. Toggle in header. Preference stored in localStorage.

## Security

- Helmet middleware (HTTP security headers)
- CORS whitelist (not `*`)
- Rate limiting (100 req/15min general, 10 req/15min auth)
- JWT access (15min) + refresh (7d) tokens
- Refresh token rotation on refresh
- bcrypt password hashing (10 rounds)
- RBAC on all endpoints
- Zod validation on all inputs
- File upload validation (MIME type, size limit)

## Performance

- Redis cache for org structure and sessions
- Pagination on all list endpoints
- Database indexes on foreign keys and frequently filtered fields
- Frontend code splitting (React.lazy for routes)
- Debounced search inputs (300ms)
- React Query staleTime/cacheTime configured

## Design Decisions

### Register Returns Tokens (v1.0.1)

`register()` now returns `accessToken` + `refreshToken` like `login()`, so users can immediately authenticate without a second login call after registration.

### Invite Endpoint (v1.0.1)

New `/auth/invite` endpoint allows HR_ADMIN users to create accounts with specific roles (HR_ADMIN, MANAGER, EMPLOYEE). `inviteSchema` includes role validation and password complexity. Self-registration (`/auth/register`) assigns EMPLOYEE role only.

### Environment Helpers (v1.0.1)

`optional()`, `optionalInt()`, and `parseDuration()` helper functions added to `env.ts`. All `parseInt(process.env.X || 'Y')` patterns replaced with typed helpers. `JWT_REFRESH_EXPIRES_IN_MS` added for refresh token expiry calculation.

### RBAC Naming Consistency (v1.0.1)

`authorize` middleware renamed to `requireRole` for consistency with other projects in the portfolio. Backward-compatible `authorize = requireRole` alias exported to avoid breaking existing imports.
