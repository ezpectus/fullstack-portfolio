#!/bin/bash
set -e

echo ""
echo "[E-commerce Admin] Starting with Docker..."
echo ""

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "[ERROR] Docker is not installed. Please install Docker from https://docker.com"
    exit 1
fi

# Copy .env if not exists
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "[INFO] Copied .env.example to .env"
    fi
fi

echo "[INFO] Building and starting containers..."
docker-compose up --build
