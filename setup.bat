@echo off
REM InterviewOS Setup Script for Windows

echo.
echo 🚀 InterviewOS - Project Setup
echo ==============================
echo.

REM Check Docker Compose
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Docker Compose not found.
    echo Please install Docker Desktop: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

echo ✅ Docker Compose found
echo.

REM Setup environment files
echo 📝 Setting up environment files...
echo.

if not exist "backend\.env" (
    (
        echo DATABASE_URL=postgres://interviewos:interviewos_dev@postgres:5432/interviewos
        echo REDIS_URL=redis://redis:6379
        echo JWT_SECRET=dev-secret-key-change-in-production
        echo OPENAI_API_KEY=your-api-key
        echo PORT=8080
        echo ENV=development
    ) > "backend\.env"
    echo ✅ Created backend\.env
) else (
    echo ✅ backend\.env already exists
)

if not exist "frontend\.env.local" (
    (
        echo NEXT_PUBLIC_API_URL=http://localhost:8080
        echo NEXT_PUBLIC_WS_URL=ws://localhost:8080
    ) > "frontend\.env.local"
    echo ✅ Created frontend\.env.local
) else (
    echo ✅ frontend\.env.local already exists
)

echo.
echo 🐳 Starting InterviewOS with Docker Compose...
echo.
echo Services starting:
echo   - PostgreSQL (localhost:5432^)
echo   - Redis (localhost:6379^)
echo   - Backend API (http://localhost:8080^)
echo   - Frontend (http://localhost:3000^)
echo.
echo Press Ctrl+C to stop all services
echo.

docker-compose up

echo.
echo 👋 Services stopped.
pause
