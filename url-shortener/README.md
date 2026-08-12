# URL Shortener

A modern URL shortener with analytics, QR codes, REST API, and dashboard. Built with Node.js, Express, TypeScript, Prisma, PostgreSQL, Redis, React, Vite, TailwindCSS, and Framer Motion.

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

This application lets users create short aliases for long URLs, track clicks, generate QR codes, and manage links through a dashboard. It also exposes a REST API with API key authentication for programmatic access.

## Features

- **Short Links** — Create short links with custom aliases, expiry dates, password protection, and bulk CSV import
- **Redirect** — 301 redirect with Redis cache for O(1) lookup, click tracking (IP, user-agent, referer, geo)
- **QR Codes** — Generate and download QR codes as PNG/SVG for any short link
- **Analytics** — Click statistics: total/period, daily chart, geography, devices, browsers, referers, unique visitors
- **REST API** — Programmatic access with API key authentication and rate limiting
- **Dashboard** — Overview stats, 30-day click chart, top links, quick action
- **Settings** — Custom domain, code length, domain blacklist

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
| QR | qrcode |
| Charts | Recharts |
| Auth | JWT (access + refresh), bcrypt |
| Validation | Zod |
| Testing | Vitest + Supertest |
| API Docs | Swagger/OpenAPI 3.0 |

## Project Structure

```
url-shortener/
├── backend/              ← Node.js + Express + TypeScript
│   ├── src/
│   │   ├── config/       # env, db, redis, swagger
│   │   ├── middleware/   # auth, rbac, validate, rateLimit, errorHandler
│   │   ├── modules/      # auth, users, links, redirects, analytics, qrcodes, api-keys, dashboard, settings
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

- **Email:** `demo@urlshortener.com`
- **Password:** `demo1234`

## User Roles

| Role | Permissions |
|---|---|
| **Admin** | Everything: users, links, settings, domain config, all analytics |
| **User** | Create and manage own links, view own analytics, generate QR codes |

## Architecture

The backend uses modular feature folders for links, redirects, analytics, QR codes, and API keys. Redis caches short code → URL mappings for fast redirects. Click data is recorded and aggregated for analytics. The frontend dashboard shows link stats, charts, and QR code downloads. See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Database

PostgreSQL with Prisma. Key models: User, Link, Click, Analytic, ApiKey, Setting. See [docs/DATABASE.md](docs/DATABASE.md).

## API

RESTful API with Swagger. Main groups: Auth, Users, Links, Redirects, Analytics, QR Codes, API Keys, Dashboard. See [docs/API.md](docs/API.md).

## Testing

```bash
cd backend
npm test
```

## Security

- JWT access + refresh token authentication with bcrypt password hashing
- `authenticate` middleware on /logout and /me routes
- `authRateLimiter` on /me route
- API keys hashed via SHA-256 before storage; plaintext shown only once on creation
- API key listing returns masked keys only
- `requireAdmin` uses shared `ROLES` constant (no hardcoded strings)
- Analytics endpoints enforce ownership checks (user can only see own link data)
- Repository pattern enforced — no direct Prisma access from routes or services
- Password complexity validation (min 8 chars, letters + numbers)
- Helmet security headers + CORS whitelist
- Zod validation on all inputs

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
