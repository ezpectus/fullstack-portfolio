#!/bin/bash
set -e

echo "============================================"
echo "  Library Management System - Docker Start"
echo "============================================"
echo

if ! command -v docker &> /dev/null; then
    echo "[ERROR] Docker is not installed. Please install Docker."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "[ERROR] docker-compose is not installed."
    exit 1
fi

if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "[INFO] Created .env from .env.example"
    fi
fi

echo "[INFO] Building and starting containers..."
docker-compose up --build
