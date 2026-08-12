# Deployment Guide — URL Shortener

This guide covers how to deploy the URL Shortener in development, staging, and production using Docker or manual setup.

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
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/url_shortener_db` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |
| `JWT_ACCESS_SECRET` | JWT access token secret | `random-access-secret` |
| `JWT_REFRESH_SECRET` | JWT refresh token secret | `random-refresh-secret` |
| `PORT` | Backend port | `4000` |
| `CORS_ORIGINS` | Allowed origins | `http://localhost:3000` |
| `SHORT_DOMAIN` | Public domain for short links | `https://short.example.com` |

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
# Clone the repository
git clone <repo-url>
cd url-shortener

# Copy environment file
cp .env.example .env

# Install dependencies
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# Run database migrations
cd backend
npx prisma generate
npx prisma migrate dev
npx prisma db seed

# Start development servers
# From project root:
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
| Backend API | 4000 | Express + TypeScript |
| Frontend | 3000 | Vite dev server (dev) / Nginx (prod) |
| PostgreSQL | 5432 | Database |
| Redis | 6379 | Cache |

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

- Backend: `GET http://localhost:4000/health`
- Swagger docs: `GET http://localhost:4000/api-docs`
- Frontend: `GET http://localhost:3000`

## Cloud Deployment

### Frontend → Vercel

1. Connect repository to Vercel
2. Set root directory to `frontend/`
3. Set `VITE_API_URL` environment variable to backend URL
4. Deploy

### Backend → Railway

1. Connect repository to Railway
2. Set root directory to `backend/`
3. Add environment variables
4. Add PostgreSQL and Redis plugins
5. Run `npx prisma migrate deploy` as a release command
6. Deploy

### Database → Supabase

1. Create a new PostgreSQL project on Supabase
2. Copy connection string to `DATABASE_URL`
3. Run `npx prisma migrate deploy`

### Redis → Upstash

1. Create a Redis database on Upstash
2. Copy connection string to `REDIS_URL`

## Troubleshooting

### Database connection error

- Verify `DATABASE_URL`
- Ensure PostgreSQL is running and accessible

### Redis connection error

- Verify `REDIS_URL`
- Ensure Redis is running

### CORS errors

- Update `CORS_ORIGINS` to include the frontend URL

### Short links not redirecting

- Check `SHORT_DOMAIN` configuration
- Verify Redis cache is accessible
- Confirm the short code exists and is not expired

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
- [ ] `SHORT_DOMAIN` configured for public short links
- [ ] Redis memory monitoring
