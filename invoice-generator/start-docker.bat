@echo off
setlocal enabledelayedexpansion

echo.
echo [96m========================================[0m
echo [96m  Invoice Generator - Starting (Docker)  [0m
echo [96m========================================[0m
echo.

REM Check Docker
where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo [91m[ERROR] Docker is not installed. Please install Docker Desktop.[0m
    echo        Download: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('docker --version') do set DOCKER_VERSION=%%i
echo [92m[OK] Docker found: %DOCKER_VERSION%[0m

REM Copy .env.example to .env if not exists
if not exist ".env" (
    if exist ".env.example" (
        copy .env.example .env >nul
        echo [92m[OK] Created .env from .env.example[0m
    )
)

echo.
echo [96m[INFO] Building and starting Docker containers...[0m
echo.

docker-compose up --build

echo.
echo [92m[OK] Backend:  http://localhost:4000[0m
echo [92m[OK] Frontend: http://localhost:3000[0m
echo [92m[OK] Swagger:  http://localhost:4000/api-docs[0m
echo.

pause
