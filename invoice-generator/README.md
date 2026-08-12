# Invoice Generator

A professional invoice generator with PDF export, email sending, and payment tracking. Built with Node.js, Express, TypeScript, Prisma, PostgreSQL, Redis, React, Vite, TailwindCSS, and Framer Motion.

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

This application lets small businesses and freelancers create professional invoices, manage clients, track payments, and analyze revenue. Invoices can be exported as PDFs and sent directly to clients via email.

## Features

- **Invoices** — Create invoices with auto-generated numbers, line items, auto-calculated totals, multi-currency, status management (draft/sent/paid/overdue/cancelled), PDF preview and download
- **Clients** — CRUD clients with invoice history, balance tracking (billed/paid/outstanding)
- **Company Profile** — Company details, logo, tax number, invoice numbering settings, bank details
- **Reports** — Revenue by period, overdue invoices, top clients, billed vs paid charts, CSV export
- **Dashboard** — Monthly billed/paid/overdue stats, recent invoices, quick action, revenue chart
- **Templates** — Saved line item templates for quick invoice creation
- **PDF** — Professional PDF generation with company logo
- **Email** — Send invoice PDF to client via email

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
| State | React Query 5 (server), Zustand 4 (client) |
| PDF | pdfkit |
| Email | nodemailer |
| Charts | Recharts |
| Auth | JWT (access + refresh), bcrypt |
| Validation | Zod |
| Testing | Vitest + Supertest |
| API Docs | Swagger/OpenAPI 3.0 |

## Project Structure

```
invoice-generator/
├── backend/              ← Node.js + Express + TypeScript
│   ├── src/
│   │   ├── config/       # env, db, redis, swagger
│   │   ├── middleware/   # auth, rbac, validate, rateLimit, errorHandler
│   │   ├── modules/      # auth, users, clients, company, invoices, templates, reports, dashboard
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

# Seed database
npx prisma db seed

# Start development servers
npm run dev
```

## Access

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:4000
- **Swagger docs:** http://localhost:4000/api-docs

## Demo Account

- **Email:** `demo@invoicegen.com`
- **Password:** `demo1234`

## User Roles

| Role | Permissions |
|---|---|
| **Owner** | Everything: company settings, clients, invoices, reports |
| **Accountant** | Invoices, clients, reports |
| **Viewer** | View invoices and reports only |

## Architecture

The backend uses modular feature folders for clients, company profile, invoices, templates, and reports. PDF generation and email sending are handled via dedicated service layers. The frontend provides a clean dashboard with invoice list, editor, and PDF preview. See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Database

PostgreSQL with Prisma. Key models: User, CompanyProfile, Client, Invoice, InvoiceItem, Template, Payment, Report. See [docs/DATABASE.md](docs/DATABASE.md).

## API

RESTful API with Swagger. Main groups: Auth, Users, Company, Clients, Invoices, Templates, Reports, Dashboard. See [docs/API.md](docs/API.md).

## Testing

```bash
cd backend
npm test
```

## Security

- **JWT Auth:** Access token (15min) in memory (Zustand) + refresh token (7d) in httpOnly cookie
- **Password Hashing:** bcrypt with configurable salt rounds
- **Rate Limiting:** Auth endpoints (5 req/15min), API endpoints (100 req/15min)
- **RBAC:** Role-based access control (Owner / Accountant / Viewer) on routes and frontend nav
- **Refresh Token Rotation:** Opaque tokens with DB-backed revocation
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
