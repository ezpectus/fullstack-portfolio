# Deployment Guide — CRM System

This guide covers how to deploy the CRM System in development, staging, and production environments using Docker or manual setup.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Local Development](#local-development)
- [Docker Deployment](#docker-deployment)
- [Production Build](#production-build)
- [Database Migrations](#database-migrations)
- [Seeding](#seeding)
- [Health Checks](#health-checks)
- [Troubleshooting](#troubleshooting)
- [Production Checklist](#production-checklist)

## Prerequisites

- Docker 24+ and Docker Compose 2+ (recommended)
- Node.js 20+ (for local development)
- PostgreSQL 16+ (if not using Docker)
- Redis 7+ (if not using Docker)

## Environment Variables

Copy `.env.example` to `.env` and configure the following:

```bash
cp .env.example .env
```

### Required

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/crm_db` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |
| `JWT_ACCESS_SECRET` | Secret for access tokens | `random-access-secret` |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens | `random-refresh-secret` |
| `PORT` | Backend port | `4000` |
| `CORS_ORIGIN` | Allowed frontend origin | `http://localhost:3000` |

### Optional

| Variable | Description | Default |
|---|---|---|
| `NODE_ENV` | Runtime environment | `development` |
| `JWT_ACCESS_EXPIRES_IN` | Access token TTL | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token TTL | `7d` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` (15 min) |
| `RATE_LIMIT_MAX` | Max requests per window | `100` |

## Local Development

### Without Docker

```bash
# Install dependencies
npm install

# Start PostgreSQL and Redis locally
# Then run migrations and seed
cd backend
npx prisma generate
npx prisma migrate dev
npx prisma db seed

# Start backend
npm run dev

# In another terminal, start frontend
cd ../frontend
npm run dev
```

### With Launch Scripts

```bash
# Windows
start.bat

# Linux / macOS
chmod +x start.sh
./start.sh
```

## Docker Deployment

### Development

```bash
docker-compose up -d --build
```

### Production

```bash
docker-compose up -d --build
```

### Services

| Service | Port | Description |
|---|---|---|
| backend | 4000 | Express API server |
| frontend | 3000 | Vite dev server or Nginx |
| postgres | 5432 | PostgreSQL database |
| redis | 6379 | Redis cache |

### View Logs

```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Stop

```bash
docker-compose down
```

## Production Build

### Backend

```bash
cd backend
npm install --production
npm run build
npm start
```

### Frontend

```bash
cd frontend
npm install
npm run build
```

The frontend build output is in `frontend/dist/` and can be served by Nginx.

## Database Migrations

In production, use `prisma migrate deploy` instead of `prisma migrate dev`:

```bash
cd backend
npx prisma migrate deploy
```

## Seeding

Seed is intended for development only. Do not run in production with real data:

```bash
cd backend
npx prisma db seed
```

## Health Checks

- Backend: `GET http://localhost:4000/api/health`
- Swagger docs: `GET http://localhost:4000/api-docs`
- Frontend: `GET http://localhost:3000`

## Troubleshooting

### Database connection error

- Verify `DATABASE_URL` is correct
- Ensure PostgreSQL is running and accessible
- Check firewall rules for port 5432

### Redis connection error

- Verify `REDIS_URL` is correct
- Ensure Redis is running on the configured host/port

### CORS errors in browser

- Update `CORS_ORIGIN` to match the frontend URL
- For multiple origins, use a comma-separated list or regex

### Migrations fail

- Make sure `prisma/migrations` folder is tracked in Git
- Run `npx prisma migrate reset` in development only

## Production Checklist

- [ ] Use strong, unique `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS and set `secure` cookie flag
- [ ] Configure `CORS_ORIGIN` to allow only trusted domains
- [ ] Run `npx prisma migrate deploy` before starting the app
- [ ] Set up database backups
- [ ] Configure log aggregation and monitoring
- [ ] Use a reverse proxy (Nginx / Caddy / Traefik)
- [ ] Set up rate limiting and DDoS protection at the edge
- [ ] Keep dependencies up to date
