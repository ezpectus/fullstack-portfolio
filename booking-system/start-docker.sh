#!/bin/bash
set -e

echo "============================================"
echo "  Booking System - Docker Startup"
echo "============================================"
echo

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "[ERROR] Docker is not installed. Please install Docker."
    exit 1
fi

# Check .env
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        echo "[INFO] Copying .env.example to .env..."
        cp .env.example .env
    else
        echo "[ERROR] No .env or .env.example found."
        exit 1
    fi
fi

echo "[INFO] Building and starting containers..."
docker-compose up --build

echo
echo "[INFO] Services:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:4000"
echo "  Swagger:  http://localhost:4000/api-docs"
