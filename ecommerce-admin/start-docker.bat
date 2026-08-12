@echo off
setlocal

echo.
echo [E-commerce Admin] Starting with Docker...
echo.

REM Check Docker
where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not installed. Please install Docker Desktop from https://docker.com
    exit /b 1
)

REM Copy .env if not exists
if not exist ".env" (
    if exist ".env.example" (
        copy .env.example .env >nul
        echo [INFO] Copied .env.example to .env
    )
)

echo [INFO] Building and starting containers...
docker-compose up --build

endlocal
