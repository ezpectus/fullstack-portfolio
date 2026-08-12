# Hospital Management System

A full-stack hospital management application built with React, Express, Prisma, and PostgreSQL. It covers the daily workflow of a medical institution: doctors, patients, appointments, medical records, departments, and analytics.

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

This system helps hospitals and clinics manage doctors, patients, appointments, medical records, and departments in one place. It includes a real-time dashboard, appointment conflict detection, notification system, and RBAC for different medical staff roles.

## Features

- **Dashboard**: Overview of hospital stats, upcoming appointments, recent activity
- **Doctors**: Manage doctor profiles, specializations, departments, consultation fees
- **Patients**: Patient registration, medical history, insurance info, emergency contacts
- **Appointments**: Schedule, track, and manage patient appointments with conflict detection
- **Schedule**: Doctor working hours, time-off management, service offerings
- **Medical Records**: Patient examination records, diagnoses, prescriptions, epicrisis
- **Departments**: Hospital department management with doctor assignments
- **Reports**: Appointment, patient, doctor, and revenue analytics
- **Notifications**: Real-time notification system for appointment reminders

## Tech Stack

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express 4
- **Language**: TypeScript 5
- **ORM**: Prisma 5
- **Database**: PostgreSQL 16
- **Cache**: Redis 7 (distributed locks)
- **Auth**: JWT (access + refresh), bcrypt
- **Validation**: Zod
- **Docs**: Swagger/OpenAPI 3.0
- **Testing**: Vitest + Supertest

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite 5
- **Language**: TypeScript 5
- **Styling**: TailwindCSS 3
- **UI**: shadcn/ui + custom components
- **Animations**: Framer Motion
- **State**: Zustand 4 (client), React Query 5 (server)
- **Charts**: Recharts

## Project Structure

```
hospital-management/
├── backend/              ← Node.js + Express + TypeScript
│   ├── src/
│   │   ├── config/       # env, db, redis, swagger
│   │   ├── middleware/   # auth, rbac, validate, rateLimit, errorHandler
│   │   ├── modules/      # doctors, patients, appointments, records, departments, reports
│   │   └── app.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── package.json
├── frontend/             ← React + Vite + TailwindCSS
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── features/
│   │   ├── store/
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
1. Clone the repository and open the project folder.
2. Backend setup:
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev
```
3. Frontend setup (in a new terminal):
```bash
cd frontend
npm install
npm run dev
```

## Access

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:4000
- **Swagger docs:** http://localhost:4000/api/docs

## Demo Accounts

| Role          | Email                    | Password       |
|---------------|--------------------------|----------------|
| Admin         | admin@hospital.com       | admin123       |
| Doctor        | doctor@hospital.com      | doctor123      |
| Receptionist  | reception@hospital.com   | reception123   |
| Patient       | patient@example.com      | patient123     |

## User Roles

| Role | Permissions |
|---|---|
| **Admin** | Everything: users, doctors, patients, departments, settings |
| **Doctor** | Own profile, appointments, medical records, schedule |
| **Receptionist** | Appointments, patients, doctor schedule view |
| **Patient** | Own profile, appointments, medical records |

## Architecture

The backend uses feature modules with a layered architecture (controller → service → repository). Middleware enforces authentication, RBAC, validation, and rate limiting. The frontend is organized around feature folders and uses React Query for server state, Zustand for client state, and TailwindCSS for styling.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for full details.

## Database

PostgreSQL with Prisma ORM. Redis is used for distributed locks and caching. See [docs/DATABASE.md](docs/DATABASE.md) for the full schema.

## API

RESTful API documented with Swagger at `/api/docs`. Main groups: Auth, Users, Doctors, Patients, Appointments, Medical Records, Departments, Reports.

## Testing

Backend tests:
```bash
cd backend
npm test
```

## Security

- JWT access (15min) + opaque refresh tokens (`crypto.randomBytes`, not JWT)
- Refresh token rotation with `revokedAt` revocation tracking
- bcrypt password hashing (10 rounds)
- RBAC middleware (4 roles: ADMIN, DOCTOR, RECEPTIONIST, PATIENT)
- Rate limiting on auth routes (`authRateLimiter` on /refresh)
- `authenticate` middleware on /logout and /me
- Self-registration restricted to PATIENT role; admin-only `/invite` for privileged roles
- Password complexity validation (min 8 chars, letters + numbers)
- httpOnly cookies with `secure` flag in production
- Helmet security headers + CORS whitelist
- Zod validation on all inputs
- Centralized error hierarchy (`AppError` base with `Object.setPrototypeOf`)

## Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for production deployment instructions, environment variables, and Docker Compose configuration.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [API Reference](docs/API.md)
- [Database Schema](docs/DATABASE.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Changelog](docs/CHANGELOG.md)

## License

MIT
