# Architecture — Booking System

## Table of Contents

- [System Overview](#system-overview)
- [Tech Stack](#tech-stack)
- [Design System](#design-system)
- [UX Design](#ux-design)
- [API Endpoints](#api-endpoints)

## System Overview

Universal booking system for appointments (gym, doctor, salon, consultation). Calendar-centric with real-time slot availability, Redis distributed lock for race condition prevention, and email notifications.

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js 20+, Express 4, TypeScript 5 |
| ORM | Prisma 5 |
| Database | PostgreSQL 16 |
| Cache/Lock | Redis 7 (distributed lock) |
| Frontend | React 18, Vite 5, TailwindCSS 3 |
| UI | shadcn/ui + custom components |
| State | React Query 5 (server), Zustand 4 (client) |
| Calendar | @fullcalendar/react |
| Charts | Recharts |
| Animations | Framer Motion |
| Email | Nodemailer |
| Auth | JWT (access + refresh), bcrypt |

## Design System

### Color Palette — Warm Orange-Coral

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--background` | `20 60% 99%` | `20 30% 8%` | App background |
| `--foreground` | `20 40% 15%` | `20 30% 95%` | Text |
| `--card` | `0 0% 100%` | `20 30% 12%` | Cards |
| `--primary` | `14 90% 58%` | `14 90% 55%` | Primary actions, buttons |
| `--accent` | `340 75% 55%` | `340 75% 60%` | Accents, highlights |
| `--secondary` | `20 40% 96%` | `20 25% 16%` | Secondary surfaces |
| `--muted` | `20 40% 96%` | `20 25% 16%` | Muted backgrounds |
| `--destructive` | `0 84% 60%` | `0 63% 31%` | Errors, cancel |
| `--border` | `20 30% 90%` | `20 25% 18%` | Borders |

### Typography

- **Font**: Poppins (300, 400, 500, 600, 700)
- **Headings**: 600/700 weight
- **Body**: 400 weight, 14-16px
- **Small**: 12px, muted color

### Spacing

- 4px base unit
- Card padding: 24px
- Section gap: 24px
- Element gap: 12px

## UX Design

### User Journeys

#### 1. Booking Flow (Customer)
1. **Login** → Enter credentials → Dashboard
2. **New Booking** → Click "New Booking" button
3. **Select Service** → Browse services (cards with duration, price) → Pick one
4. **Select Provider** → See available providers for that service → Pick one (or "Any Provider")
5. **Select Date** → Calendar view with available slots highlighted
6. **Select Slot** → Time slots grid → Click available slot
7. **Confirm** → Review summary → Confirm booking
8. **Confirmation** → Animated success → Email sent → Booking appears in calendar

#### 2. Provider Schedule Management
1. **Login** as Provider → Dashboard shows today's bookings
2. **Schedule** → Calendar week view → See all bookings
3. **Block Slots** → Drag to select time range → Block with reason
4. **Manage Bookings** → Click booking → Confirm/Cancel/Complete
5. **Vacation** → Set date range → All slots blocked

#### 3. Admin Dashboard
1. **Login** as Admin → Dashboard with stats
2. **View Stats** → Today's bookings, revenue, no-show rate, provider utilization
3. **Manage Services** → CRUD services with duration, price
4. **Manage Providers** → CRUD providers, assign services, set working hours
5. **Settings** → Business hours, timezone, cancellation policy, buffer time

### Wireframes

```
┌─────────────────────────────────────────────────┐
│ [Logo] BookingHub          [Dark] [Bell] [User] │
├──────────┬──────────────────────────────────────┤
│          │                                      │
│ Dashboard│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐│
│ Bookings │  │Today │ │Week  │ │Revenue│ │NoShow││
│ Calendar │  │  12  │ │  48  │ │ $2.4k│ │  5%  ││
│ Services │  └──────┘ └──────┘ └──────┘ └──────┘│
│ Providers│                                      │
│ Customers│  ┌──────────────────────────────────┐│
│ Settings │  │       Calendar (FullCalendar)    ││
│          │  │  Mon  Tue  Wed  Thu  Fri  Sat   ││
│          │  │ [9:00] [9:00] [----] [9:30] ... ││
│          │  │ [10:0] [10:0] [10:0] [----] ... ││
│          │  └──────────────────────────────────┘│
│          │                                      │
│          │  ┌─────────────┐  ┌────────────────┐ │
│          │  │ Top Services│  │ Top Providers  │ │
│          │  │ 1. Massage  │  │ 1. Dr. Smith   │ │
│          │  │ 2. Consult  │  │ 2. Jane Doe    │ │
│          │  └─────────────┘  └────────────────┘ │
└──────────┴──────────────────────────────────────┘
```

### Interactive Elements (Framer Motion)

| Element | Animation | Duration |
|---|---|---|
| Page transitions | Fade + slide up | 300ms |
| Booking step transitions | Slide left/right between steps | 250ms |
| Slot selection hover | Scale 1.05 + border highlight | 150ms |
| Calendar drag-and-drop | Item follows cursor, slot highlights on hover | 200ms |
| Booking confirmation | Scale + fade success checkmark | 400ms |
| Toast notifications | Slide in from right | 300ms |
| Skeleton loading | Shimmer effect | 2s loop |
| Dashboard stats | Number counter animation | 500ms |
| Scroll reveal | Fade + slide up on scroll | 400ms |
| Button hover/tap | Scale 0.97 on tap, color shift on hover | 100ms |
| List items | Staggered fade-in | 80ms stagger |

## API Endpoints

### Auth
- `POST /auth/register` — Register
- `POST /auth/login` — Login
- `POST /auth/refresh` — Refresh token
- `POST /auth/logout` — Logout
- `GET /auth/me` — Current user

### Services
- `GET /services` — List services
- `GET /services/:id` — Get service
- `POST /services` — Create service (Admin)
- `PATCH /services/:id` — Update (Admin)
- `DELETE /services/:id` — Delete (Admin)

### Providers
- `GET /providers` — List providers
- `GET /providers/:id` — Get provider with services and schedule
- `POST /providers` — Create (Admin)
- `PATCH /providers/:id` — Update (Admin)
- `DELETE /providers/:id` — Delete (Admin)

### Bookings
- `GET /bookings` — List bookings (filterable)
- `GET /bookings/:id` — Get booking detail
- `POST /bookings` — Create booking (with Redis lock + conflict check)
- `PATCH /bookings/:id/status` — Update status
- `DELETE /bookings/:id` — Cancel booking

### Schedule
- `GET /schedule/:providerId` — Get provider schedule
- `GET /schedule/:providerId/slots` — Get available slots for date
- `POST /schedule/block` — Block slots (Provider/Admin)
- `DELETE /schedule/block/:id` — Unblock slots

### Customers
- `GET /customers` — List customers
- `GET /customers/:id` — Get customer with booking history
- `POST /customers` — Create
- `PATCH /customers/:id` — Update
- `DELETE /customers/:id` — Delete

### Notifications
- `GET /notifications` — List notifications
- `POST /notifications/send` — Send notification (Admin)

### Dashboard
- `GET /dashboard/overview` — Stats + today's bookings

### Settings
- `GET /settings` — Get business settings
- `PATCH /settings` — Update settings (Admin)

## Database Schema

### ER Diagram

```
User (Admin/Provider/Staff) 1───* Service *───* ServiceProvider *───* Provider
Service ─── Booking *───* Customer
Booking ─── Schedule
Provider ─── WorkingHours
Provider ─── TimeOff (vacations/blockouts)
```

### Key Models

- **User**: id, email, password, name, role (ADMIN/PROVIDER/STAFF/CUSTOMER)
- **Service**: id, name, description, duration (15/30/60/90), price, category, active
- **Provider**: id, userId, bio, avatar, isActive
- **ServiceProvider**: id, serviceId, providerId (many-to-many)
- **WorkingHours**: id, providerId, dayOfWeek (0-6), startTime, endTime
- **TimeOff**: id, providerId, startDate, endDate, reason
- **Booking**: id, serviceId, providerId, customerId, date, startTime, endTime, status, notes, cancellationReason
- **Customer**: id, name, email, phone, notes
- **Schedule**: id, providerId, date, slots (blocked/available)
- **Settings**: id, key, value

## Security

- JWT access (15min) + refresh (7d) tokens
- Refresh tokens in httpOnly cookies
- bcrypt password hashing (10 rounds)
- RBAC middleware (4 roles)
- Rate limiting (100 req/15min general, 10 req/15min auth)
- Zod validation on all inputs
- Redis distributed lock for slot booking (prevents race conditions)
- CORS configured for allowed origins
- Helmet security headers

## Design Decisions

### Booking Ownership Checks (v1.0.1)

`bookings.service.create` and `bookings.service.delete` now accept a `user` parameter. PROVIDER role users can only create bookings for their own provider profile and delete bookings assigned to them. RBAC middleware (`requireRole(ADMIN, PROVIDER)`) added to the create route.

### Duration Parsing (v1.0.1)

`parseDuration()` function added to env config. `JWT_REFRESH_EXPIRES_IN` is parsed from human-readable format (`7d`, `15m`) to milliseconds (`refreshExpiresInMs`). Both refresh token expiry and cookie `maxAge` use this value instead of `parseInt` with day-only assumption.

### Cookie Security (v1.0.1)

Cookie `secure` flag now uses `env.isProduction` instead of raw `process.env.NODE_ENV` check. Cookie `maxAge` uses `env.jwt.refreshExpiresInMs` for consistency with token expiry.
