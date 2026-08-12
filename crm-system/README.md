# CRM System

A mini-CRM for managing customer relationships — clients, deals (pipeline), notes, and dashboard analytics. Built for small businesses, freelancers, and B2B sales teams. It supports multi-user collaboration with role-based access, data export, and an interactive dashboard.

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
- [User Roles & Permissions](#user-roles--permissions)
- [Architecture](#architecture)
- [Database](#database)
- [API](#api)
- [Testing](#testing)
- [Security](#security)
- [Deployment](#deployment)
- [Documentation](#documentation)
- [License](#license)

## Overview

This project provides a complete customer relationship management workflow. Users can manage a customer base, track sales deals through a customizable Kanban pipeline, attach rich-text notes to customers and deals, and view real-time performance metrics on a dashboard.

## Features

- **Customers** — CRUD with search, filtering by status and tags, pagination, interaction timeline, and file attachments
- **Deals** — Kanban board with drag-and-drop (New → Contacted → Qualified → Proposal → Won/Lost), deal value, currency, expected close date, win probability
- **Notes** — Rich-text notes (markdown) attached to customers or deals, with pinning for important notes
- **Dashboard** — Key metrics, deals by stage (bar chart), new customers over time (line chart), recent activity feed
- **Auth** — JWT (access + refresh tokens), RBAC (Admin / Manager / Sales Rep), user invitations
- **Export** — CSV export for customers and deals
- **Responsive UI** — TailwindCSS + shadcn/ui components, dark mode support, animated transitions with Framer Motion

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js 20+, Express 4, TypeScript 5 |
| ORM | Prisma 5 |
| Database | PostgreSQL 16 |
| Cache | Redis 7 |
| Frontend | React 18, Vite 5, TailwindCSS 3 |
| UI | shadcn/ui |
| State (server) | TanStack React Query 5 |
| State (client) | Zustand 4 |
| Charts | Recharts |
| Auth | JWT (access + refresh), bcrypt |
| Validation | Zod |
| Testing | Vitest + Supertest |
| API Docs | Swagger/OpenAPI 3.0 |

## Project Structure

```
crm-system/
├── backend/              ← Node.js + Express + TypeScript
│   ├── src/
│   │   ├── config/       # env, db, redis, swagger
│   │   ├── middleware/   # auth, rbac, validate, rateLimit, errorHandler
│   │   ├── modules/      # feature modules (auth, customers, deals, notes, dashboard, users)
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
├── docker-compose.yml    ← Full stack: app + db + redis
└── start.bat / start.sh  ← Launch scripts
```

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 16 (running locally or via Docker)
- Redis 7

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
# With Docker
start-docker.sh       # Linux / macOS
start-docker.bat      # Windows
```

### Manual Setup

```bash
# Install dependencies
npm install

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

| Email | Password | Role |
|---|---|---|
| `demo@crm.com` | `demo1234` | Admin |

Additional users can be invited from the application once logged in.

## User Roles & Permissions

| Role | Permissions |
|---|---|
| **Admin** | Everything: users, settings, deletion, export |
| **Manager** | CRUD customers/deals/notes, sees their team |
| **Sales Rep** | CRUD own customers/deals/notes only |

## Architecture

The backend follows a modular feature-based structure. Each domain (customers, deals, notes, users) has its own controller, service, repository, routes, and schemas. Middleware handles authentication, RBAC, validation, and rate limiting. The frontend uses a component-driven design with React Query for server state and Zustand for client state.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for full details.

## Database

PostgreSQL is used as the primary database with Prisma as the ORM. Redis is used for caching and session/token storage. See [docs/DATABASE.md](docs/DATABASE.md) for the schema diagram and model descriptions.

## API

RESTful API documented with Swagger. Main groups: Auth, Users, Customers, Deals, Notes, Dashboard, Export. See [docs/API.md](docs/API.md).

## Testing

Backend tests use Vitest with Supertest:

```bash
cd backend
npm test
```

## Security

- **JWT Auth:** Access token (15m) + refresh token (7d) in httpOnly cookie
- **Password Hashing:** bcrypt with configurable salt rounds
- **Rate Limiting:** Auth endpoints (5 req/15min), API endpoints (100 req/15min)
- **RBAC:** Role-based access control (Admin / Manager / Sales Rep) on routes and frontend nav
- **CSV Injection Protection:** Export cells starting with `=`, `+`, `-`, `@` are prefixed with `'`
- **Pagination Limit:** MAX_PAGE_SIZE enforced to prevent excessive query results
- **Refresh Token Rotation:** Opaque tokens (crypto.randomBytes) with DB-backed revocation

## Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for environment setup, build process, Docker instructions, and production checklist.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [API Reference](docs/API.md)
- [Database Schema](docs/DATABASE.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Changelog](docs/CHANGELOG.md)

## License

MIT
