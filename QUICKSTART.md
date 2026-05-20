# Quick Start Guide

## Prerequisites

- Docker & Docker Compose installed
- Or: Node.js 18+ and Go 1.21+ for manual setup

## 🚀 Fastest Way to Start

### Linux/Mac
```bash
chmod +x setup.sh
./setup.sh
```

### Windows
```bash
setup.bat
```

This will:
1. Check Docker is installed
2. Create environment files
3. Start all services

## 🌐 Access the Application

Once services are running:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Database**: localhost:5432
- **Cache**: localhost:6379

## 📝 Create Your First Account

1. Go to http://localhost:3000
2. Click "Sign Up"
3. Fill in email, password, name
4. Click "Sign Up Free"

## 📅 Schedule Your First Interview

1. Go to Dashboard
2. Click "Schedule Interview"
3. Fill in:
   - Title (e.g., "Senior Dev Interview")
   - Description
   - Candidate Email
   - Date & Time
   - Duration
4. Click "Schedule Interview"

## 🎥 Join an Interview Room

1. Go to Dashboard
2. Find your interview
3. Click "Join"
4. Allow camera/microphone access
5. Start the interview!

## 🛑 Stop Services

Press `Ctrl+C` in the terminal running Docker Compose

```bash
# Or manually
docker-compose down
```

## 🔧 Manual Setup (Without Docker)

See [SETUP.md](./SETUP.md) for detailed instructions.

## 📚 Learn More

- [SETUP.md](./SETUP.md) - Complete setup guide
- [API.md](./API.md) - API documentation
- [ROADMAP.md](./ROADMAP.md) - Feature roadmap
- [frontend/README.md](./frontend/README.md) - Frontend docs
- [backend/README.md](./backend/README.md) - Backend docs

## ⚠️ Troubleshooting

### Port Already in Use
```bash
# Mac/Linux - Find process on port 3000
lsof -i :3000
kill -9 <PID>

# Windows - Find process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Can't Connect to Backend
1. Check backend is running: `curl http://localhost:8080/health`
2. Check `NEXT_PUBLIC_API_URL` in `frontend/.env.local`
3. Check Docker logs: `docker-compose logs backend`

### WebRTC Not Working
1. Open browser console (F12)
2. Check for WebRTC errors
3. Make sure you allowed camera/microphone access
4. Check firewall isn't blocking WebRTC

### Database Connection Failed
1. Ensure PostgreSQL is running
2. Check Docker logs: `docker-compose logs postgres`
3. Verify `DATABASE_URL` in `backend/.env`

## 💡 Tips

- Use `make dev` to run frontend and backend manually
- Use `make help` for all available commands
- Check [Makefile](./Makefile) for useful tasks

## 🎓 Next Steps

1. Explore the codebase
2. Read [BUILD_SUMMARY.md](./BUILD_SUMMARY.md)
3. Check [ROADMAP.md](./ROADMAP.md) for upcoming features
4. Contribute! See [CONTRIBUTING.md](./CONTRIBUTING.md)

---

**Questions?** See [SETUP.md](./SETUP.md) or check GitHub Issues
