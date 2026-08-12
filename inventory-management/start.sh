#!/bin/bash

set -e

echo ""
echo "============================================"
echo "  Inventory Management - Starting (No Docker)"
echo "============================================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed. Please install Node.js 20+."
    echo "        Download: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v)
echo "[OK] Node.js found: $NODE_VERSION"

# Check PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "[WARN] PostgreSQL not found in PATH. Make sure it's running."
else
    echo "[OK] PostgreSQL found"
fi

# Check Redis
if ! command -v redis-cli &> /dev/null; then
    echo "[WARN] Redis not found in PATH. Make sure it's running on localhost:6379"
else
    echo "[OK] Redis found"
fi

# Copy .env.example to .env if not exists
if [ ! -f ".env" ] && [ -f ".env.example" ]; then
    cp .env.example .env
    echo "[OK] Created .env from .env.example"
fi

# Install dependencies
echo ""
echo "[INFO] Installing dependencies..."
npm install

# Generate Prisma client
echo ""
echo "[INFO] Generating Prisma client..."
cd backend
npx prisma generate

# Run Prisma migrations
echo ""
echo "[INFO] Running database migrations..."
npx prisma migrate dev

# Seed database
echo ""
echo "[INFO] Seeding database..."
npx prisma db seed
cd ..

echo ""
echo "[INFO] Starting backend (port 4000) and frontend (port 3000)..."
echo ""
echo "[OK] Backend:  http://localhost:4000"
echo "[OK] Frontend: http://localhost:3000"
echo "[OK] Swagger:  http://localhost:4000/api-docs"
echo ""

npm run dev
