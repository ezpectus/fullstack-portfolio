#!/bin/bash

set -e

echo ""
echo "========================================"
echo "   URL Shortener - Starting with Docker"
echo "========================================"
echo ""

if ! command -v docker &> /dev/null; then
    echo "[ERROR] Docker is not installed or not in PATH."
    echo "        Download: https://www.docker.com/"
    exit 1
fi

if [ ! -f ".env" ] && [ -f ".env.example" ]; then
    cp .env.example .env
    echo "[OK] Created .env from .env.example"
fi

echo "[INFO] Building and starting containers..."
docker-compose up --build
