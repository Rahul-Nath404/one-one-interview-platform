# InterviewOS - Setup Guide

A comprehensive guide to getting InterviewOS up and running.

## Prerequisites

### Required Software
- **Node.js 18+** - For frontend development
- **Go 1.21+** - For backend development  
- **Docker & Docker Compose** - For containerized deployment (recommended)
- **PostgreSQL 14+** - Database (can run in Docker)
- **Redis 7+** - Cache/session store (can run in Docker)
- **Git** - Version control

### System Requirements
- RAM: 4GB minimum (8GB recommended)
- Disk Space: 2GB minimum
- OS: Windows 10+, macOS 10.15+, or Linux (Ubuntu 20.04+)

## Installation Options

### Option 1: Docker Compose (Recommended) ⭐

Easiest way to get started. Requires only Docker and Docker Compose.

**Step 1: Clone/Setup Project**
```bash
cd interview_help
```

**Step 2: Run Everything**
```bash
docker-compose up
```

**Step 3: Access the Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- Database: localhost:5432
- Redis: localhost:6379

That's it! Docker Compose handles all the setup.

### Option 2: Manual Setup (Development)

For local development without Docker.

#### Backend Setup

**Step 1: Install Go**
- Download from https://golang.org/dl/
- Add to PATH

**Step 2: Setup Database**
```bash
# Option A: Install PostgreSQL locally
# Option B: Use Docker
docker run --name postgres -e POSTGRES_PASSWORD=interviewos_dev \
  -e POSTGRES_DB=interviewos \
  -p 5432:5432 -d postgres:15

# Option C: Create database manually
createdb -U postgres interviewos
```

**Step 3: Setup Redis**
```bash
# Option A: Install Redis locally (https://redis.io/download)
# Option B: Use Docker
docker run --name redis -p 6379:6379 -d redis:7
```

**Step 4: Configure Backend**
```bash
cd backend
cp .env.example .env  # Edit with your database credentials
```

**Step 5: Run Backend**
```bash
cd backend
go mod download
go run main.go
```

Backend will start on http://localhost:8080

#### Frontend Setup

**Step 1: Install Node.js**
- Download from https://nodejs.org/ (LTS version recommended)

**Step 2: Install Dependencies**
```bash
cd frontend
npm install
```

**Step 3: Configure Frontend**
```bash
cd frontend
cp .env.example .env.local
```

**Step 4: Run Frontend**
```bash
npm run dev
```

Frontend will start on http://localhost:3000

### Option 3: Cloud Deployment

#### Deploy Frontend to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel
```

#### Deploy Backend to AWS/Render/Heroku

See deployment documentation in backend/README.md

## Verification

### Test Backend
```bash
curl http://localhost:8080/health
# Should return: {"status":"ok","message":"InterviewOS API is running"}
```

### Test Frontend
```bash
# Open browser and navigate to:
# http://localhost:3000
```

### Test Database Connection
```bash
# In backend logs, should see:
# Database initialized successfully
```

## Configuration

### Environment Variables

#### Backend (.env)
```bash
# Database
DATABASE_URL=postgres://interviewos:interviewos_dev@localhost:5432/interviewos

# Cache
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-super-secret-key-change-in-production

# AI (optional)
OPENAI_API_KEY=sk-...

# Server
PORT=8080
ENV=development
```

#### Frontend (.env.local)
```bash
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_WS_URL=ws://localhost:8080
```

## Project Structure

```
interview_help/
├── frontend/                 # Next.js React application
│   ├── app/                 # Pages and layouts
│   ├── components/          # React components
│   │   ├── ui/             # Base UI components
│   │   └── InterviewRoom.tsx # Video room component
│   ├── lib/                # Utilities
│   │   ├── api.ts          # Backend API client
│   │   ├── types.ts        # TypeScript types
│   │   └── webrtc.ts       # WebRTC utilities
│   ├── store/              # State management
│   │   ├── authStore.ts    # Auth state
│   │   └── interviewStore.ts # Interview state
│   ├── styles/             # Global CSS
│   ├── package.json        # Dependencies
│   └── README.md           # Frontend docs
│
├── backend/                 # Go backend services
│   ├── main.go             # Server entry point
│   ├── go.mod              # Go dependencies
│   ├── .env                # Configuration
│   ├── Dockerfile          # Container config
│   ├── internal/           # Internal packages
│   │   ├── handlers/       # HTTP handlers
│   │   ├── models/         # Data models
│   │   ├── middleware/     # Auth middleware
│   │   ├── utils/          # Utilities (JWT, etc)
│   │   └── db/             # Database setup
│   ├── migrations/         # SQL migration files
│   └── README.md           # Backend docs
│
├── docker-compose.yml      # Docker Compose configuration
└── README.md              # Main documentation
```

## Development Workflow

### Starting Development

**Terminal 1 - Backend:**
```bash
cd backend
go run main.go
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Terminal 3 - Logs/Monitoring:**
```bash
docker logs -f interviewos_postgres
docker logs -f interviewos_redis
```

### Making Changes

**Backend Changes:**
- Modify files in `backend/internal/`
- Server auto-reloads
- Check `http://localhost:8080/health`

**Frontend Changes:**
- Modify files in `frontend/app/` or `frontend/components/`
- Next.js auto-reloads on save
- Check `http://localhost:3000`

### Database Migrations

The backend automatically applies migrations on startup via GORM's `AutoMigrate()`.

For manual SQL migrations, add `.sql` files to `backend/migrations/` and they'll be applied on startup.

## Troubleshooting

### Port Already in Use
```bash
# Find process using port
lsof -i :8080  # Linux/Mac
netstat -ano | findstr :8080  # Windows

# Kill process
kill -9 <PID>  # Linux/Mac
taskkill /PID <PID> /F  # Windows
```

### Database Connection Failed
```bash
# Check PostgreSQL is running
psql -U interviewos -d interviewos

# Check CONNECTION_URL format
DATABASE_URL=postgres://user:password@host:port/database
```

### Redis Connection Failed
```bash
# Test Redis connection
redis-cli ping
# Should return: PONG
```

### Frontend Can't Reach Backend
```bash
# Check backend is running
curl http://localhost:8080/health

# Check NEXT_PUBLIC_API_URL is correct
# Frontend .env.local should have:
# NEXT_PUBLIC_API_URL=http://localhost:8080
```

### WebRTC Connection Not Working
```bash
# Check browser console (F12 > Console)
# Look for WebRTC errors
# Verify ICE servers are reachable
# Check firewall isn't blocking connections
```

## Common Commands

### Frontend Development
```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm build

# Type checking
npm run type-check

# Linting
npm run lint
```

### Backend Development
```bash
cd backend

# Download dependencies
go mod download

# Run server
go run main.go

# Run tests
go test ./...

# Build binary
go build -o interviewos

# Format code
go fmt ./...
```

### Docker Commands
```bash
# Build images
docker-compose build

# Start services
docker-compose up

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Access database
docker-compose exec postgres psql -U interviewos

# Access Redis
docker-compose exec redis redis-cli
```

## Next Steps

1. **Create your first account**: http://localhost:3000/signup
2. **Schedule an interview**: Dashboard → Schedule Interview
3. **Test video room**: Click "Join Interview"
4. **Explore the code**: Review `/frontend` and `/backend` READMEs

## Getting Help

### Documentation
- Frontend: See `frontend/README.md`
- Backend: See `backend/README.md`
- API Docs: See `API.md` (if available)

### Community
- GitHub Issues: Report bugs and request features
- GitHub Discussions: Ask questions and discuss

### Performance Tips

1. **Frontend**: Use React DevTools to profile components
2. **Backend**: Use pprof for profiling
3. **Database**: Monitor slow queries with PostgreSQL logs
4. **Redis**: Use redis-cli MONITOR for debugging

## Security Checklist

Before production deployment:

- [ ] Change JWT_SECRET to a strong random value
- [ ] Enable HTTPS/TLS encryption
- [ ] Set up CORS properly
- [ ] Enable database SSL
- [ ] Implement rate limiting
- [ ] Set up monitoring and alerts
- [ ] Enable audit logging
- [ ] Regular security updates

## Support & Contact

- GitHub: [Project Repository]
- Email: support@interviewos.com
- Slack: [Join Slack Channel]

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Go Documentation](https://golang.org/doc/)
- [Fiber Framework](https://docs.gofiber.io/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Redis Docs](https://redis.io/documentation)
- [WebRTC Documentation](https://webrtc.org/)
