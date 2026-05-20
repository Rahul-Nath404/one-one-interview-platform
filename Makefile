.PHONY: help install dev build start stop clean docker-up docker-down test lint

help:
	@echo "InterviewOS - Makefile Commands"
	@echo ""
	@echo "Development:"
	@echo "  make install        - Install all dependencies"
	@echo "  make dev           - Start development servers"
	@echo "  make frontend-dev  - Start frontend only"
	@echo "  make backend-dev   - Start backend only"
	@echo ""
	@echo "Docker:"
	@echo "  make docker-up     - Start all services with Docker Compose"
	@echo "  make docker-down   - Stop all services"
	@echo "  make docker-logs   - View Docker logs"
	@echo ""
	@echo "Build & Deployment:"
	@echo "  make build         - Build frontend and backend"
	@echo "  make build-frontend - Build frontend only"
	@echo "  make build-backend - Build backend binary"
	@echo ""
	@echo "Testing & Quality:"
	@echo "  make test          - Run tests"
	@echo "  make lint          - Run linters"
	@echo "  make type-check    - TypeScript type checking"
	@echo ""
	@echo "Cleaning:"
	@echo "  make clean         - Clean build artifacts"
	@echo "  make clean-all     - Deep clean everything"

# Installation
install:
	@echo "Installing dependencies..."
	cd frontend && npm install
	cd backend && go mod download

# Development
dev:
	@echo "Starting development servers..."
	@echo "Frontend: http://localhost:3000"
	@echo "Backend: http://localhost:8080"
	@echo ""
	@echo "Press Ctrl+C to stop"
	@trap 'kill %1 %2' EXIT; \
	cd frontend && npm run dev & \
	cd backend && go run main.go & \
	wait

frontend-dev:
	cd frontend && npm run dev

backend-dev:
	cd backend && go run main.go

# Docker
docker-up:
	docker-compose up

docker-down:
	docker-compose down

docker-logs:
	docker-compose logs -f

docker-clean:
	docker-compose down -v

# Build
build: build-frontend build-backend

build-frontend:
	@echo "Building frontend..."
	cd frontend && npm run build

build-backend:
	@echo "Building backend..."
	cd backend && go build -o interviewos

# Testing
test:
	@echo "Running tests..."
	cd backend && go test ./...

test-frontend:
	cd frontend && npm test

# Quality
lint:
	@echo "Running linters..."
	cd frontend && npm run lint
	cd backend && go fmt ./...

type-check:
	cd frontend && npm run type-check

# Cleaning
clean:
	@echo "Cleaning build artifacts..."
	rm -rf frontend/.next frontend/node_modules/.cache
	rm -rf backend/*.o backend/interviewos

clean-all: clean docker-clean
	@echo "Deep cleaning..."
	rm -rf frontend/node_modules
	rm -rf backend/vendor
	rm -rf .DS_Store **/.DS_Store

# Database
db-migrate:
	cd backend && go run main.go

db-reset:
	docker-compose down -v
	docker-compose up postgres

# Utilities
setup-env:
	@echo "Setting up environment files..."
	@if [ ! -f backend/.env ]; then cp backend/.env.example backend/.env 2>/dev/null || echo "backend/.env.example not found"; fi
	@if [ ! -f frontend/.env.local ]; then cp frontend/.env.example frontend/.env.local 2>/dev/null || echo "frontend/.env.example not found"; fi

format:
	cd frontend && npm run format 2>/dev/null || echo "No format script"
	cd backend && go fmt ./...

# Production
production-setup:
	@echo "Production setup checklist"
	@echo "1. Update JWT_SECRET in backend/.env"
	@echo "2. Update DATABASE_URL for production database"
	@echo "3. Update REDIS_URL for production Redis"
	@echo "4. Set ENV=production in backend/.env"
	@echo "5. Deploy frontend to Vercel"
	@echo "6. Deploy backend to production server"
