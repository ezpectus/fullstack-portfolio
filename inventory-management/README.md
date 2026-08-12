# Inventory Management System

A full-stack inventory management application for tracking warehouse stock, products, suppliers, purchase orders, and stock movements with barcode generation and real-time low-stock alerts.

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

This application provides a central warehouse and inventory control center. It tracks products across multiple warehouses, records stock movements, manages suppliers and purchase orders, generates barcodes, and alerts managers when stock falls below configured thresholds.

## Features

- **Products** — CRUD with SKU, barcode generation, category assignment, min stock levels, cost/sell pricing, image uploads, movement history
- **Categories** — Nested tree structure, product filtering by category
- **Warehouses** — CRUD with address, manager assignment, current stock levels per warehouse
- **Stock Movements** — In/out/transfer/adjustment with product, warehouse, type, quantity, date, comment, user tracking
- **Suppliers** — CRUD with contact info, email, phone
- **Purchase Orders** — Draft/sent/received statuses, line items, auto stock movement on receive
- **Dashboard** — Total inventory value, low-stock alerts, top products by value, movement chart, pending/received POs
- **Export** — CSV export for products, stock levels, movements; PDF barcode labels
- **Auth** — JWT (access + refresh tokens), RBAC (Admin / Warehouse Manager / Staff)

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js 20+, Express 4, TypeScript 5 |
| ORM | Prisma 5 |
| Database | PostgreSQL 16 |
| Cache | Redis 7 |
| Frontend | React 18, Vite 5, TailwindCSS 3 |
| UI | shadcn/ui + custom components |
| Animations | Framer Motion |
| State (server) | TanStack React Query 5 |
| State (client) | Zustand 4 |
| Charts | Recharts |
| Barcode | jsbarcode |
| Auth | JWT (access + refresh), bcrypt |
| Validation | Zod |
| Testing | Vitest + Supertest |
| API Docs | Swagger/OpenAPI 3.0 |

## Project Structure

```
inventory-management/
├── backend/              ← Node.js + Express + TypeScript
│   ├── src/
│   │   ├── config/       # env, db, redis, swagger
│   │   ├── middleware/   # auth, rbac, validate, rateLimit, errorHandler
│   │   ├── modules/      # auth, users, products, categories, warehouses, stock-movements, suppliers, purchase-orders, dashboard
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

## Demo Account

- **Email:** `demo@inventory.com`
- **Password:** `demo1234`

## User Roles

| Role | Permissions |
|---|---|
| **Admin** | Everything: warehouses, suppliers, users, settings |
| **Warehouse Manager** | CRUD products, movements, purchase orders, inventory adjustments |
| **Staff** | View products, create in/out movements, search |

## Architecture

The backend uses feature modules for products, categories, warehouses, stock movements, suppliers, and purchase orders. Stock movement operations update inventory totals and trigger low-stock alerts. The frontend provides dashboards with charts and barcode printing. See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Database

PostgreSQL with Prisma. Key models: User, Warehouse, Category, Product, StockMovement, Supplier, PurchaseOrder, PurchaseOrderItem. See [docs/DATABASE.md](docs/DATABASE.md).

## API

RESTful API with Swagger. Main groups: Auth, Users, Products, Categories, Warehouses, Stock Movements, Suppliers, Purchase Orders, Dashboard. See [docs/API.md](docs/API.md).

## Testing

```bash
cd backend
npm test
```

## Security

- **JWT Auth:** Access token (15min) in memory (Zustand) + refresh token (7d) in httpOnly cookie
- **Refresh Token Rotation:** Opaque tokens stored in DB with `revokedAt` for revocation
- **Password Hashing:** bcrypt with configurable salt rounds
- **Rate Limiting:** Auth endpoints (5 req/15min), API endpoints (100 req/15min)
- **RBAC:** Role-based access control (Admin / Manager / Staff) on routes and frontend nav
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
