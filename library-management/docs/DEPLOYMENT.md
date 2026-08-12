# Deployment Guide — Library Management System

This guide covers how to deploy the Library Management System in development, staging, and production using Docker or manual setup.

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

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

### Required

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/library_db` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |
| `JWT_ACCESS_SECRET` | JWT access token secret | `random-access-secret` |
| `JWT_REFRESH_SECRET` | JWT refresh token secret | `random-refresh-secret` |
| `PORT` | Backend port | `4000` |
| `CORS_ORIGINS` | Allowed origins | `http://localhost:3000,http://localhost:5173` |

### Email (SMTP)

| Variable | Description | Default |
|---|---|---|
| `SMTP_HOST` | SMTP server host | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP server port | `587` |
| `SMTP_USER` | SMTP username | — |
| `SMTP_PASS` | SMTP password | — |
| `SMTP_FROM` | From email address | `noreply@library.com` |

### Business Rules

| Variable | Description | Default |
|---|---|---|
| `FINE_PER_DAY` | Fine amount per overdue day | `0.50` |
| `LOAN_PERIOD_DAYS` | Default loan period | `14` |
| `MAX_RENEWALS` | Maximum renewals per loan | `2` |
| `RESERVATION_EXPIRY_DAYS` | Reservation hold period | `3` |

### Optional

| Variable | Description | Default |
|---|---|---|
| `NODE_ENV` | Runtime environment | `development` |
| `JWT_ACCESS_EXPIRES_IN` | Access token TTL | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token TTL | `7d` |
| `BCRYPT_SALT_ROUNDS` | bcrypt salt rounds | `10` |

## Local Development

### Without Docker

```bash
cp .env.example .env
npm install

# Backend
cd backend
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev

# Frontend (new terminal)
cd frontend
npm install
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
cp .env.example .env
docker-compose up --build
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

In production, use `prisma migrate deploy`:

```bash
cd backend
npx prisma migrate deploy
```

## Seeding

Seed is for development only:

```bash
cd backend
npx prisma db seed
```

## Health Checks

- Backend: `GET http://localhost:4000/api/health`
- Swagger docs: `GET http://localhost:4000/api/docs`
- Frontend: `GET http://localhost:3000`

## Troubleshooting

### Database connection error

- Verify `DATABASE_URL`
- Ensure PostgreSQL is running and accessible

### Redis connection error

- Verify `REDIS_URL`
- Ensure Redis is running

### CORS errors

- Update `CORS_ORIGINS` to include the frontend URL

### Emails not sending

- Check SMTP settings
- Verify `SMTP_FROM` is allowed by your provider

### Migrations fail

- Ensure `prisma/migrations` is tracked
- Use `npx prisma migrate reset` in development only

## Production Checklist

- [ ] Strong JWT secrets
- [ ] `NODE_ENV=production`
- [ ] HTTPS enabled with secure cookies
- [ ] `CORS_ORIGINS` restricted
- [ ] `npx prisma migrate deploy` executed
- [ ] Database backups configured
- [ ] Log aggregation and monitoring
- [ ] Reverse proxy with rate limiting
- [ ] SMTP configured for notifications
- [ ] Business rules (`FINE_PER_DAY`, `LOAN_PERIOD_DAYS`, etc.) reviewed
