#!/bin/bash

set -e

echo ""
echo "============================================"
echo "  Inventory Management - Starting (Docker)  "
echo "============================================"
echo ""

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "[ERROR] Docker is not installed. Please install Docker."
    echo "        Download: https://www.docker.com/products/docker-desktop/"
    exit 1
fi

DOCKER_VERSION=$(docker --version)
echo "[OK] Docker found: $DOCKER_VERSION"

# Check Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "[ERROR] Docker Compose is not installed."
    exit 1
fi

echo "[OK] Docker Compose found"

# Copy .env.example to .env if not exists
if [ ! -f ".env" ] && [ -f ".env.example" ]; then
    cp .env.example .env
    echo "[OK] Created .env from .env.example"
fi

echo ""
echo "[INFO] Building and starting containers..."
echo ""
echo "[OK] Backend:  http://localhost:4000"
echo "[OK] Frontend: http://localhost:3000"
echo "[OK] Swagger:  http://localhost:4000/api-docs"
echo "[OK] PostgreSQL: localhost:5432"
echo "[OK] Redis: localhost:6379"
echo ""

docker-compose up --build
