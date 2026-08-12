@echo off
echo ============================================
echo   Library Management System - Docker Start
echo ============================================
echo.

where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not installed. Please install Docker Desktop.
    exit /b 1
)

where docker-compose >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] docker-compose is not installed.
    exit /b 1
)

if not exist .env (
    if exist .env.example (
        copy .env.example .env >nul
        echo [INFO] Created .env from .env.example
    )
)

echo [INFO] Building and starting containers...
docker-compose up --build

pause
