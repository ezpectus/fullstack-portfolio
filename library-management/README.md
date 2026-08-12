# Library Management System

A full-stack library management application with book tracking, member management, loan processing, reservations, fines, and reporting.

> This project is part of the [Portfolio Series Monorepo](../../README.md) — a collection of 9 full-stack applications demonstrating modern web development practices.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Quick Start (Windows)](#quick-start-windows)
  - [Quick Start (Linux / macOS)](#quick-start-linux--macos)
  - [Docker](#docker)
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

This application helps public, school, and private libraries manage their catalog, members, loans, reservations, and fines. It tracks book copies individually, supports loan renewals, reservation queues, and provides dashboards with circulation statistics.

## Features

- JWT authentication with refresh tokens
- Role-based access control (ADMIN, LIBRARIAN, MEMBER)
- Book catalog with ISBN, categories, and cover images
- Book copy tracking with status management
- Loan processing with due dates and renewals
- Reservation system with fulfillment workflow
- Fine calculation and payment/waiver
- Dashboard with monthly loan charts and popular books
- Reports with genre distribution and CSV export
- Rate limiting and input validation
- Responsive UI with Framer Motion animations

## Tech Stack

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express 4
- **Language**: TypeScript 5
- **ORM**: Prisma 5
- **Database**: PostgreSQL 16
- **Auth**: JWT (access + refresh), bcrypt
- **Validation**: Zod
- **Docs**: Swagger/OpenAPI 3.0
- **Caching**: Redis 7
- **Rate Limiting**: express-rate-limit
- **Testing**: Vitest + Supertest

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite 5
- **Language**: TypeScript 5
- **State**: Zustand 4 (client), React Query 5 (server)
- **Routing**: React Router v6
- **Styling**: TailwindCSS 3
- **UI**: shadcn/ui + custom components
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React

## Project Structure

```
library-management/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── config/         # env, db, redis, swagger
│   │   ├── middleware/     # auth, rbac, validate, rateLimit, asyncHandler, errorHandler
│   │   ├── modules/        # feature-based modules
│   │   │   ├── auth/       # register, login, refresh, me
│   │   │   ├── books/      # CRUD books
│   │   │   ├── book-copies/# CRUD book copies
│   │   │   ├── members/    # list, detail, loans, fines
│   │   │   ├── loans/      # create, return, renew
│   │   │   ├── reservations/ # create, cancel, fulfill
│   │   │   ├── fines/      # pay, waive
│   │   │   ├── dashboard/  # aggregate stats
│   │   │   ├── reports/    # analytics, export
│   │   │   └── users/      # user management
│   │   ├── shared/         # errors
│   │   └── app.ts
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/            # axios client + endpoints
│   │   ├── components/     # Layout, UI, animations
│   │   ├── features/       # page-level components
│   │   ├── lib/            # utils
│   │   ├── store/          # zustand stores
│   │   ├── types/          # TypeScript types
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
├── docs/                   # Architecture, API, Database, Deployment, Changelog
├── docker-compose.yml
└── start.bat / start.sh
```

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL 16+
- Redis 7+

### Quick Start (Windows)
```bash
start.bat
```

### Quick Start (Linux / macOS)
```bash
chmod +x start.sh
./start.sh
```

### Docker
```bash
cp .env.example .env
# Linux / macOS
chmod +x start-docker.sh && ./start-docker.sh
# Windows
start-docker.bat
```

### Manual Setup

Backend:
```bash
cd backend
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Frontend (in a new terminal):
```bash
cd frontend
npm install
npm run dev
```

## Access

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:4000
- **Swagger UI:** http://localhost:4000/api/docs

## Demo Accounts

| Role | Email | Password |
|---|---|---|
| **Admin** | admin@library.com | admin123 |
| **Librarian** | lib@library.com | lib123 |
| **Member** | member@library.com | member123 |

## User Roles

| Role | Permissions |
|---|---|
| **Admin** | Everything: users, settings, books, members, loans, fines |
| **Librarian** | Books, members, loans, reservations, fines, reports |
| **Member** | Own profile, borrowed books, reservations, fines |

## Architecture

The backend is split into feature modules (books, book-copies, members, loans, reservations, fines, reports). Each module follows controller-service structure. Middleware handles authentication, RBAC, validation, and async errors. The frontend uses a sidebar layout with dashboards and data tables. See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Database

PostgreSQL with Prisma. Key models: User, Book, BookCopy, Member, Loan, Reservation, Fine, Category, Report. See [docs/DATABASE.md](docs/DATABASE.md).

## API

RESTful API with Swagger. Main groups: Auth, Users, Books, Book Copies, Members, Loans, Reservations, Fines, Reports, Dashboard. See [docs/API.md](docs/API.md).

## Testing

```bash
cd backend
npm test
```

## Security

- **JWT Auth:** Access token (15m) in memory + refresh token (7d) in httpOnly cookie
- **Password Hashing:** bcrypt with configurable salt rounds
- **Rate Limiting:** Auth endpoints (5 req/15min), API endpoints (100 req/15min)
- **RBAC:** Role-based access control (Admin / Librarian / Member) on routes and frontend nav
- **Refresh Token Rotation:** Opaque tokens (crypto.randomBytes) with DB-backed revocation
- **QueryClient Clear on Logout:** Prevents stale data exposure across sessions
- **CSV Injection Protection:** Cell values starting with `=+-@` are escaped in CSV exports

## Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for Docker, environment variables, and production checklist.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [API Reference](docs/API.md)
- [Database Schema](docs/DATABASE.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Changelog](docs/CHANGELOG.md)

## License

MIT
