# Booking System

Universal booking system for appointments — gym, doctor, salon, consultation. Calendar-centric with real-time slot availability, Redis distributed locks for race condition prevention, and email notifications.

> This project is part of the [Portfolio Series Monorepo](../../README.md) — a collection of 9 full-stack applications demonstrating modern web development practices.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Quick Start (No Docker)](#quick-start-no-docker)
  - [Quick Start (Docker)](#quick-start-docker)
  - [Manual Setup](#manual-setup)
- [Access](#access)
- [Demo Accounts](#demo-accounts)
- [User Roles](#user-roles)
- [Architecture](#architecture)
- [Database](#database)
- [API](#api)
- [Testing](#testing)
- [Security](#security)
- [Deployment](#deployment)
- [Documentation](#documentation)
- [License](#license)

## Overview

This platform lets businesses manage services, providers, customer bookings, and schedules in one place. Customers can browse services, pick a provider, and book an available time slot. Providers can manage their calendars, block time off, and confirm or cancel bookings. Admins can configure business settings and view analytics.

## Features

- **Services** — CRUD with duration (15/30/60/90 min), price, description, category, provider assignment
- **Providers** — CRUD with working hours per weekday, vacations/blockouts, assigned services
- **Bookings** — Multi-step flow (service → provider → date → slot), conflict check with Redis distributed lock, statuses (pending → confirmed → completed / cancelled / no-show), cancellation with reason, email notifications
- **Schedule** — Calendar view (week/day) per provider, color-coded slots, drag-and-drop reschedule, bulk slot blocking
- **Customers** — CRUD with booking history, notes, one-click rebooking
- **Dashboard** — Today/week bookings, revenue, top services, top providers, no-show rate, provider utilization
- **Settings** — Business hours, timezone, cancellation policy, buffer between bookings
- **Notifications** — Email confirmation, 24h reminder, cancellation notification (Nodemailer)

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
| Validation | Zod |
| Testing | Vitest + Supertest |
| API Docs | Swagger/OpenAPI 3.0 |

## Project Structure

```
booking-system/
├── backend/              ← Node.js + Express + TypeScript
│   ├── src/
│   │   ├── config/       # env, db, redis, swagger
│   │   ├── middleware/   # auth, rbac, validate, rateLimit, errorHandler
│   │   ├── modules/      # auth, users, services, providers, bookings, customers, schedule, dashboard, settings
│   │   └── app.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── package.json
├── frontend/             ← React + Vite + TailwindCSS
│   ├── src/
│   │   ├── api/          # axios client + endpoints
│   │   ├── components/   # shared UI
│   │   ├── features/     # page-level components
│   │   ├── store/        # zustand stores
│   │   └── types/
│   └── package.json
├── docs/                 ← Architecture, API, Database, Deployment, Changelog
├── docker-compose.yml
└── start.bat / start.sh
```

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL 16+
- Redis 7+

### Quick Start (No Docker)

```bash
cp .env.example .env
npm run install:all
npm run db:migrate
npm run db:seed
npm run dev
```

### Quick Start (Docker)

```bash
cp .env.example .env
docker-compose up --build
```

### Manual Setup

```bash
# Install dependencies
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# Copy environment file
cp .env.example .env

# Generate Prisma client
cd backend && npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed the database
npx prisma db seed

# Start backend (port 4000)
npm run dev

# Start frontend (port 3000) — in another terminal
cd frontend && npm run dev
```

## Access

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:4000
- **Swagger docs:** http://localhost:4000/api-docs

## Demo Accounts

| Role | Email | Password |
|---|---|---|
| Admin | `admin@booking.com` | `admin123` |
| Provider | `provider@booking.com` | `provider123` |
| Staff | `staff@booking.com` | `staff123` |
| Customer | `customer@booking.com` | `customer123` |

## User Roles

| Role | Permissions |
|---|---|
| **Admin/Owner** | Everything: users, services, providers, bookings, settings |
| **Provider/Staff** | Own schedule, confirm/cancel bookings, own customers |
| **Customer** | Book, cancel, view history |

## Architecture

The backend uses modular feature folders. Each domain has a controller, service, and validation layer. Redis distributed locks prevent double-booking of the same slot. The frontend uses a multi-step booking wizard and a FullCalendar-based schedule view. See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for full details.

## Database

PostgreSQL with Prisma. Main models: User, Service, Provider, ServiceProvider, WorkingHours, TimeOff, Customer, Booking, Schedule, Settings, Notification. See [docs/DATABASE.md](docs/DATABASE.md) for the ER diagram.

## API

RESTful API with Swagger. Main groups: Auth, Users, Services, Providers, Bookings, Customers, Schedule, Notifications, Dashboard, Settings. See [docs/API.md](docs/API.md).

## Testing

```bash
cd backend
npm test
```

## Security

- JWT access (15min) + refresh tokens in httpOnly cookies with `secure` flag in production
- bcrypt password hashing (10 rounds)
- RBAC middleware with `requireRole` (4 roles: ADMIN, PROVIDER, STAFF, CUSTOMER)
- `authenticate` middleware on /logout and /me routes
- `authRateLimiter` on /refresh route
- Booking ownership checks — PROVIDER can only create/delete bookings for own profile
- `requireRole(ADMIN, PROVIDER)` on booking creation route
- Password complexity validation (min 8 chars, letters + numbers)
- `refreshToken` optional in refresh schema (controller reads from cookies)
- `parseDuration` for configurable JWT expiry (supports `7d`, `15m`, etc.)
- Redis distributed lock for slot booking (prevents race conditions)
- Helmet security headers + CORS whitelist
- Zod validation on all inputs

## Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for production deployment, environment variables, and Docker Compose setup.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [API Reference](docs/API.md)
- [Database Schema](docs/DATABASE.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Changelog](docs/CHANGELOG.md)

## License

MIT
