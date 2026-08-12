# HR Portal

A comprehensive HR management system for managing employees, leave requests, payroll, documents, and reports.

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

This system covers the complete HR lifecycle: employee records, organizational tree, leave request workflows, payroll management, document generation, and analytics dashboards. It supports three roles with granular access control.

## Features

- **Employees**: CRUD, org structure (tree), profiles with education/experience/skills, status tracking, position/department history
- **Departments**: CRUD with hierarchy, department heads, employee lists
- **Leave Management**: Request/approve/reject, multiple leave types, balance auto-calculation, team calendar, email notifications
- **Payroll**: Payslips (salary, bonuses, deductions), period management, draft→approved→paid workflow, PDF generation, salary fund charts
- **Documents**: Upload PDFs, generate from templates (orders, certificates), employee-linked, download
- **Dashboard**: Total/active/on-leave counts, pending leave approvals, monthly salary fund, new hires, birthdays
- **Reports**: Turnover rate, average salary by department, leave usage, CSV export

## Tech Stack

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express 4
- **Language**: TypeScript 5
- **ORM**: Prisma 5
- **Database**: PostgreSQL 16
- **Cache**: Redis 7
- **Auth**: JWT (access + refresh), bcrypt, RBAC
- **PDF**: pdfkit (orders, certificates, payslips)
- **Email**: nodemailer (leave notifications, orders)
- **Testing**: Vitest + Supertest
- **Docs**: Swagger/OpenAPI 3.0

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite 5
- **Language**: TypeScript 5
- **Styling**: TailwindCSS 3
- **UI**: shadcn/ui + custom components
- **State**: Zustand 4 (client), React Query 5 (server)
- **Charts**: Recharts
- **Animations**: Framer Motion

### DevOps
- **Containerization**: Docker + docker-compose (multi-stage)

## Project Structure

```
hr-portal/
├── backend/              ← Node.js + Express + TypeScript
│   ├── src/
│   │   ├── config/       # env, db, redis, swagger
│   │   ├── middleware/   # auth, rbac, validate, rateLimit, errorHandler
│   │   ├── modules/      # auth, users, employees, departments, leaves, payroll, documents, reports, dashboard
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

### Quick Start (No Docker)

```bash
# Clone the repository
git clone <repo-url>
cd hr-portal

# Install all dependencies
npm run install:all

# Set up environment
cp .env.example .env
# Edit .env with your settings

# Run database migrations
npm run db:migrate

# Seed the database
npm run db:seed

# Start development servers
npm run dev
```

### Quick Start (Docker)

```bash
cp .env.example .env
# Linux / macOS
chmod +x start-docker.sh && ./start-docker.sh
# Windows
start-docker.bat
```

### Manual Setup

```bash
# Install dependencies
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# Copy environment
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
- **Swagger docs:** http://localhost:4000/api/docs

## Demo Accounts

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@hrportal.com` | `admin123` |
| **Manager** | `manager@hrportal.com` | `manager123` |
| **Employee** | `employee@hrportal.com` | `employee123` |

## User Roles

| Role | Permissions |
|---|---|
| **HR Admin** | Everything: employees, leave, payroll, documents, reports |
| **Manager** | Own subordinates: profiles, leave approval, reviews |
| **Employee** | Own profile, leave requests, payslips, documents |

## Architecture

The backend is split into feature modules (employees, departments, leaves, payroll, documents, reports). Shared middleware handles auth, RBAC, validation, and error handling. The frontend uses a dashboard-first layout with React Query for server state and Zustand for local UI state. See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the full design.

## Database

PostgreSQL with Prisma. Key models: User, Employee, Department, LeaveRequest, LeaveBalance, Payroll, Payslip, Document, Report. See [docs/DATABASE.md](docs/DATABASE.md).

## API

RESTful API with Swagger. Main groups: Auth, Users, Employees, Departments, Leaves, Payroll, Documents, Reports, Dashboard. See [docs/API.md](docs/API.md).

## Testing

```bash
cd backend
npm test
```

## Security

- JWT access (15min) + opaque refresh tokens (`crypto.randomBytes`, not JWT)
- Refresh token rotation with `revokedAt` revocation tracking
- bcrypt password hashing (10 rounds)
- RBAC with `requireRole` middleware (3 roles: HR_ADMIN, MANAGER, EMPLOYEE)
- `authenticate` + `authRateLimiter` on /logout route
- Admin-only `/invite` endpoint for role-specific user creation
- Self-registration assigns EMPLOYEE role only (no privilege escalation)
- Register returns tokens (no second login needed after signup)
- Password complexity validation (min 8 chars, letters + numbers)
- `parseDuration` for configurable JWT expiry
- Helmet security headers + CORS whitelist
- Zod validation on all inputs
- File upload validation (MIME type, size limit)

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
