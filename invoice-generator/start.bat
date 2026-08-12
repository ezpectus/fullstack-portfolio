@echo off
setlocal enabledelayedexpansion

echo.
echo [96m========================================[0m
echo [96m  Invoice Generator - Starting (No Docker)[0m
echo [96m========================================[0m
echo.

REM Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [91m[ERROR] Node.js is not installed. Please install Node.js 20+.[0m
    echo        Download: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo [92m[OK] Node.js found: %NODE_VERSION%[0m

REM Check PostgreSQL
where psql >nul 2>nul
if %errorlevel% neq 0 (
    echo [93m[WARN] PostgreSQL not found in PATH. Make sure it's running.[0m
) else (
    echo [92m[OK] PostgreSQL found[0m
)

REM Check Redis
where redis-cli >nul 2>nul
if %errorlevel% neq 0 (
    echo [93m[WARN] Redis not found in PATH. Make sure it's running on localhost:6379[0m
) else (
    echo [92m[OK] Redis found[0m
)

REM Copy .env.example to .env if not exists
if not exist ".env" (
    if exist ".env.example" (
        copy .env.example .env >nul
        echo [92m[OK] Created .env from .env.example[0m
    )
)

REM Install dependencies
echo.
echo [96m[INFO] Installing dependencies...[0m
call npm install
if %errorlevel% neq 0 (
    echo [91m[ERROR] Failed to install dependencies[0m
    pause
    exit /b 1
)

REM Generate Prisma client
echo.
echo [96m[INFO] Generating Prisma client...[0m
cd backend
call npx prisma generate
if %errorlevel% neq 0 (
    echo [91m[ERROR] Prisma generate failed.[0m
    pause
    exit /b 1
)

REM Run Prisma migrations
echo.
echo [96m[INFO] Running database migrations...[0m
call npx prisma migrate dev
if %errorlevel% neq 0 (
    echo [91m[ERROR] Migration failed. Check your DATABASE_URL in .env[0m
    pause
    exit /b 1
)

REM Seed database
echo.
echo [96m[INFO] Seeding database...[0m
call npx prisma db seed
cd ..

echo.
echo [96m[INFO] Starting backend (port 4000) and frontend (port 3000)...[0m
echo.
echo [92m[OK] Backend:  http://localhost:4000[0m
echo [92m[OK] Frontend: http://localhost:3000[0m
echo [92m[OK] Swagger:  http://localhost:4000/api-docs[0m
echo.

call npm run dev

pause
