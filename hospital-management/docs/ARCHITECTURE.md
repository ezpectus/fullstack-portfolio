# Architecture — Hospital Management

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Module Architecture](#module-architecture)
- [Roles & Permissions](#roles--permissions)
- [UX Design](#ux-design)

## Overview

MediCare is a comprehensive hospital management system built with a feature-based modular architecture. It handles doctors, patients, appointments, schedules, medical records, departments, and reporting.

## Tech Stack

- **Backend**: Node.js 20+, Express 4, TypeScript 5, Prisma 5, PostgreSQL 16, Redis 7
- **Frontend**: React 18, Vite 5, TailwindCSS 3, React Query 5, Zustand 4, React Router 6, Framer Motion, Recharts
- **Auth**: JWT (access + refresh tokens), RBAC middleware
- **Testing**: Vitest
- **Docs**: Swagger/OpenAPI

## Project Structure

```
hospital-management/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── config/          # env, db, redis, swagger
│   │   ├── middleware/      # auth, rbac, errorHandler, rateLimit, validate, asyncHandler
│   │   ├── modules/         # Feature-based modules
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── departments/
│   │   │   ├── doctors/
│   │   │   ├── patients/
│   │   │   ├── schedule/
│   │   │   ├── appointments/
│   │   │   ├── medical-records/
│   │   │   ├── notifications/
│   │   │   ├── dashboard/
│   │   │   └── reports/
│   │   ├── shared/          # errors, types, constants, utils, pagination, email
│   │   └── app.ts
│   └── vitest.config.ts
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Route pages
│   │   ├── store/           # Zustand stores
│   │   ├── lib/             # API client, utils
│   │   ├── types/           # TypeScript types
│   │   └── hooks/           # Custom hooks
│   └── vite.config.ts
├── docker-compose.yml
├── docker-compose.dev.yml
├── Dockerfile
├── Dockerfile.frontend
├── nginx.conf
└── docs/
```

## Module Architecture

Each backend module follows the repository pattern:
- `*.dto.ts` — Zod validation schemas
- `*.repository.ts` — Prisma database queries
- `*.service.ts` — Business logic
- `*.routes.ts` — Express routes with middleware

## Roles & Permissions

| Role | Permissions |
|------|------------|
| ADMIN | Full access to all modules |
| DOCTOR | Own schedule, own patients, medical records, appointments |
| RECEPTIONIST | Patient registration, doctor schedules, appointment booking |
| PATIENT | Own appointments, booking, medical history |

## UX Design

### Design Palette

- **Primary**: Medical green (#0d9488 / teal-600)
- **Secondary**: Clinical blue (#0284c7 / sky-500)
- **Background**: White / off-white (#f8fafc / slate-50)
- **Accent**: Soft green (#10b981 / emerald-500)
- **Text**: Slate-900 / Slate-600
- **Font**: Inter (400, 500, 600, 700)
- **Aesthetic**: Clean clinical, calming, professional

### User Journey

1. **Authentication**: Login → JWT tokens → redirect by role
2. **Appointment Booking**: Select doctor → choose date → pick time slot → confirm → notification
3. **Medical Record**: Open appointment → fill complaints/examination/diagnosis/prescriptions → save → timeline reveal
4. **Dashboard**: View today's appointments → weekly stats → doctor load → top specializations
5. **Reports**: Filter by date range → view appointment/patient/doctor/revenue reports → charts

### Wireframes

#### Login Page
- Centered card with medical logo
- Email + password fields
- Role-based redirect after login
- Framer Motion fade-in animation

#### Dashboard
- Top: 4 stat cards (appointments today, total patients, total doctors, departments) with number counter animations
- Middle: Appointment status chart (donut), top specializations (bar chart)
- Bottom: Top doctors by load (list with progress bars)
- Scroll reveal animations for sections

#### Doctors List
- Grid of doctor cards with photo, name, specialization, department
- Search bar + department filter
- Card hover lift animation
- Click → Doctor detail page

#### Doctor Detail
- Header: photo, name, specialization, department, bio
- Schedule: weekly calendar view with working hours
- Services list with prices
- Book appointment button

#### Appointments Calendar
- FullCalendar week/day view
- Color-coded by status (scheduled=blue, in-progress=amber, completed=green, cancelled=red)
- Click slot → booking modal
- Drag-and-drop reschedule

#### Patient Detail
- Header: name, age, gender, blood type, allergies, chronic conditions
- Medical records timeline (vertical, animated reveal)
- Appointment history table
- Primary doctor info

#### Reports
- Date range picker
- Tabs: Appointments | Patients | Doctors | Revenue
- Charts: bar, donut, line (Recharts)
- Export button

### Interactive Elements

- **Slot selection**: Hover highlight, click pulse animation
- **Booking confirmation**: Success checkmark animation + toast
- **Medical record timeline**: Stagger reveal of records
- **Dashboard stats**: Number counter animation on mount
- **Skeleton shimmer**: Loading states for all data fetches
- **Page transitions**: Slide/fade between routes

### Framer Motion Animations

1. `appointmentBookingFlow` — Step transitions in booking modal
2. `slotSelection` — Hover and click feedback on time slots
3. `calendarDragDrop` — Drag-and-drop appointment rescheduling
4. `medicalRecordTimeline` — Stagger reveal of medical records
5. `toast` — Slide-in notifications
6. `skeletonShimmer` — Loading placeholders
7. `dashboardScrollReveal` — Scroll-triggered section reveals
8. `numberCounters` — Animated counting for dashboard stats

## Database Schema

See [DATABASE.md](./DATABASE.md) for full schema details.

## API Documentation

See [API.md](./API.md) for endpoint documentation.
Swagger UI available at `/api/docs` when running.

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment instructions.

## Design Decisions

### Opaque Refresh Tokens (v1.0.1)

Refresh tokens are now generated using `crypto.randomBytes(40)` instead of `jwt.sign`. This makes tokens opaque — they carry no JWT payload and can only be validated by looking up the database record. This prevents information leakage and allows server-side revocation via the `revokedAt` field.

### Token Revocation (v1.0.1)

The `RefreshToken` model now includes a `revokedAt DateTime?` field. On logout and refresh, tokens are marked as revoked rather than deleted, preserving an audit trail. The `refresh()` endpoint checks `revokedAt` before issuing new tokens and revokes the old token (rotation).

### Centralized Error Hierarchy (v1.0.1)

All custom error classes now extend a single `AppError` base class from `shared/errors.ts` with `Object.setPrototypeOf` calls to ensure correct prototype chain in TypeScript. Middleware and services use specific error subclasses (`UnauthorizedError`, `ForbiddenError`, `ConflictError`, `NotFoundError`) instead of generic `AppError` with status codes.

### Environment Variable Safety (v1.0.1)

JWT secrets and `DATABASE_URL` use `required()` without fallback — the application fails fast if secrets are missing. Optional values use `optional()` / `optionalInt()` helpers. `parseDuration()` converts human-readable durations (`7d`, `15m`) to milliseconds for cookie maxAge and token expiry calculations.

### Invite-Based User Creation (v1.0.1)

The `/auth/invite` endpoint allows ADMIN users to create accounts with specific roles (DOCTOR, RECEPTIONIST, etc.). Self-registration (`/auth/register`) is restricted to PATIENT role only, preventing privilege escalation.
