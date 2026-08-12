# E-commerce Admin Panel

Admin panel for e-commerce store management — products, orders, customers, analytics. No storefront, just management.

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
- [Demo Account](#demo-account)
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

This admin panel provides everything needed to run an online store from the back office: product catalog with variants, category tree, order lifecycle, customer segmentation, promo codes, multi-currency settings, and analytics dashboard.

## Features

- **Products** — CRUD with variants (size/color/material), multiple images, SEO fields, bulk CSV import/export
- **Categories** — Nested tree structure, unlimited depth
- **Orders** — Status management (pending → processing → shipped → delivered / cancelled / refunded), packing slip PDF
- **Customers** — CRUD, order history, segmentation (VIP/regular/new), total spend
- **Promo Codes** — Percentage/fixed, usage limits, expiry, min order value, category/product binding
- **Analytics** — Revenue charts, top products/categories, average order value, refund rate
- **Settings** — Store config, taxes, shipping methods, multi-currency
- **Dashboard** — Overview stats, recent orders, revenue charts

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js 20+, Express 4, TypeScript 5 |
| ORM | Prisma 5 |
| Database | PostgreSQL 16 |
| Cache | Redis 7 |
| Frontend | React 18, Vite 5, TailwindCSS 3 |
| UI | shadcn/ui + custom components |
| State | React Query 5 (server), Zustand 4 (client) |
| Animations | Framer Motion |
| Auth | JWT (access + refresh), bcrypt |
| Charts | Recharts |
| Images | Multer + Sharp |
| Validation | Zod |
| Testing | Vitest + Supertest |
| API Docs | Swagger/OpenAPI 3.0 |

## Project Structure

```
ecommerce-admin/
├── backend/              ← Node.js + Express + TypeScript
│   ├── src/
│   │   ├── config/       # env, db, redis, swagger
│   │   ├── middleware/   # auth, rbac, validate, rateLimit, errorHandler
│   │   ├── modules/      # auth, users, products, categories, orders, customers, promo-codes, analytics, settings
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
# Copy environment
cp .env.example .env

# Install dependencies
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# Generate Prisma client
cd backend && npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed the database
npx prisma db seed

# Start both backend and frontend
npm run dev
```

### Quick Start (Docker)

```bash
cp .env.example .env
docker-compose up --build
```

### Manual Setup

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed manual setup.

## Access

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:4000
- **Swagger docs:** http://localhost:4000/api-docs

## Demo Account

- **Email:** `admin@ecommerce.com`
- **Password:** `admin123`

## User Roles

| Role | Permissions |
|---|---|
| **Super Admin** | Everything: users, settings, all modules |
| **Manager** | Products, orders, customers, categories, promo codes |
| **Staff** | Orders (view + status), customers (view) |

## Architecture

The backend is organized into modules per domain (products, categories, orders, customers, promo codes, analytics). Shared middleware enforces RBAC and validation. The frontend uses a sidebar navigation with dashboard, tables, and forms. See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Database

PostgreSQL with Prisma. Key models: User, Product, ProductVariant, Category, Order, OrderItem, Customer, PromoCode, Setting, Analytics. See [docs/DATABASE.md](docs/DATABASE.md).

## API

RESTful API documented with Swagger. Main groups: Auth, Users, Products, Categories, Orders, Customers, Promo Codes, Analytics, Settings. See [docs/API.md](docs/API.md).

## Testing

```bash
cd backend
npm test
```

## Security

- JWT access (15min) + opaque refresh tokens (`crypto.randomBytes`, not JWT)
- Refresh token rotation with `revokedAt` revocation tracking
- bcrypt password hashing (10 rounds)
- RBAC middleware (3 roles: super_admin, manager, staff)
- Global rate limiter applied before all routes
- `authenticate` middleware on /logout, /me, and static file serving
- `authLimiter` on /refresh route
- Self-registration assigns default role; no role input accepted
- Centralized error hierarchy (`AppError` base with `Object.setPrototypeOf`)
- 404 catch-all route before error handler
- Helmet security headers + CORS whitelist
- Zod validation on all inputs
- File upload validation and image processing with Sharp

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
