@echo off
setlocal enabledelayedexpansion

echo.
echo ============================================
echo   Hospital Management - Starting (No Docker)
echo ============================================
echo.

REM Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js 20+.
    echo        Download: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo [OK] Node.js found: %NODE_VERSION%

REM Check PostgreSQL
where psql >nul 2>nul
if %errorlevel% neq 0 (
    echo [WARN] PostgreSQL not found in PATH. Make sure it's running.
) else (
    echo [OK] PostgreSQL found
)

REM Check Redis
where redis-cli >nul 2>nul
if %errorlevel% neq 0 (
    echo [WARN] Redis not found in PATH. Make sure it's running on localhost:6379
) else (
    echo [OK] Redis found
)

REM Copy .env.example to .env if not exists
if not exist ".env" (
    if exist ".env.example" (
        copy .env.example .env >nul
        echo [OK] Created .env from .env.example
    )
)

REM Install dependencies
echo.
echo [INFO] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)

REM Generate Prisma client
echo.
echo [INFO] Generating Prisma client...
cd backend
call npx prisma generate
if %errorlevel% neq 0 (
    echo [ERROR] Prisma generate failed.
    pause
    exit /b 1
)

REM Run Prisma migrations
echo.
echo [INFO] Running database migrations...
call npx prisma migrate dev
if %errorlevel% neq 0 (
    echo [ERROR] Migration failed. Check your DATABASE_URL in .env
    pause
    exit /b 1
)

REM Seed database
echo.
echo [INFO] Seeding database...
call npx prisma db seed
cd ..

echo.
echo [INFO] Starting backend (port 4000) and frontend (port 3000)...
echo.
echo [OK] Backend:  http://localhost:4000
echo [OK] Frontend: http://localhost:3000
echo [OK] Swagger:  http://localhost:4000/api-docs
echo.

call npm run dev

pause
