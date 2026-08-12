@echo off
echo.
echo [96m========================================[0m
echo [96m   URL Shortener - Starting with Docker [0m
echo [96m========================================[0m
echo.

where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo [91m[ERROR] Docker is not installed or not in PATH.[0m
    echo        Download: https://www.docker.com/
    pause
    exit /b 1
)

if not exist ".env" (
    if exist ".env.example" (
        copy .env.example .env >nul
        echo [92m[OK] Created .env from .env.example[0m
    )
)

echo [96m[INFO] Building and starting containers...[0m
docker-compose up --build

pause
