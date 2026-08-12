@echo off
setlocal

echo ============================================
echo   HR Portal - Docker Startup
echo ============================================
echo.

:: Check Docker
where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not installed. Please install Docker Desktop.
    exit /b 1
)

:: Check .env
if not exist .env (
    if exist .env.example (
        echo [INFO] Copying .env.example to .env...
        copy .env.example .env >nul
    ) else (
        echo [ERROR] No .env or .env.example found.
        exit /b 1
    )
)

echo [INFO] Building and starting containers...
docker-compose up --build

echo.
echo [INFO] Services:
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:4000
echo   Swagger:  http://localhost:4000/api/docs
