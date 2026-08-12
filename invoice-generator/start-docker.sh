#!/bin/bash

echo ""
echo "========================================"
echo "  Invoice Generator - Starting (Docker)"
echo "========================================"
echo ""

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "[ERROR] Docker is not installed. Please install Docker."
    echo "        Download: https://www.docker.com/products/docker-desktop"
    exit 1
fi

DOCKER_VERSION=$(docker --version)
echo "[OK] Docker found: $DOCKER_VERSION"

# Copy .env.example to .env if not exists
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "[OK] Created .env from .env.example"
    fi
fi

echo ""
echo "[INFO] Building and starting Docker containers..."
echo ""

docker-compose up --build

echo ""
echo "[OK] Backend:  http://localhost:4000"
echo "[OK] Frontend: http://localhost:3000"
echo "[OK] Swagger:  http://localhost:4000/api-docs"
echo ""
