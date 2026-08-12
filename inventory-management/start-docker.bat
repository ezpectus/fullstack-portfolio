@echo off
setlocal enabledelayedexpansion

echo.
echo ============================================
echo   Inventory Management - Starting (Docker)
echo ============================================
echo.

REM Check Docker
where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not installed. Please install Docker Desktop.
    echo        Download: https://www.docker.com/products/docker-desktop/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('docker --version') do set DOCKER_VERSION=%%i
echo [OK] Docker found: %DOCKER_VERSION%

REM Check Docker Compose
where docker-compose >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Docker Compose is not installed.
    pause
    exit /b 1
)

echo [OK] Docker Compose found

REM Copy .env.example to .env if not exists
if not exist ".env" (
    if exist ".env.example" (
        copy .env.example .env >nul
        echo [OK] Created .env from .env.example
    )
)

echo.
echo [INFO] Building and starting containers...
echo.
echo [OK] Backend:  http://localhost:4000
echo [OK] Frontend: http://localhost:3000
echo [OK] Swagger:  http://localhost:4000/api-docs
echo [OK] PostgreSQL: localhost:5432
echo [OK] Redis: localhost:6379
echo.

docker-compose up --build

pause
