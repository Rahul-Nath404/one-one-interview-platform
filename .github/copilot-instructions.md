# InterviewOS Development Instructions

## Project Overview
InterviewOS is a full-stack interview platform built with:
- **Frontend**: Next.js 14 with TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Go with Fiber framework
- **Realtime**: WebRTC for video/audio, WebSockets for signaling
- **Database**: PostgreSQL with Redis caching

## Development Workflow

### Starting the Application
```bash
# Using Docker Compose (recommended)
docker-compose up

# Or manually:
# Terminal 1: Backend
cd backend && go run main.go

# Terminal 2: Frontend  
cd frontend && npm run dev
```

### Frontend Development
- Framework: Next.js 14 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS + shadcn/ui components
- State: Zustand for app state, React Query for server state
- Location: `frontend/app/`

### Backend Development
- Language: Go 1.21+
- Framework: Fiber
- Database: PostgreSQL (GORM ORM)
- Cache: Redis
- Location: `backend/`

## Key Features to Implement

### Phase 1 (MVP)
1. **Authentication** - Email/password and social login (JWT-based)
2. **Scheduling** - Interview scheduling with calendar integration
3. **Interview Rooms** - Secure rooms with WebRTC video/audio
4. **Collaborative Editor** - Real-time code editor using Yjs + WebSockets
5. **User Profiles** - User management and role-based access

### Phase 2
1. AI-generated summaries using OpenAI
2. Recording and transcription
3. Analytics dashboard

### Phase 3
1. ATS integrations
2. Enterprise features and anti-cheating tools

## Code Organization

### Frontend Structure
```
frontend/
├── app/              # Next.js app router pages
├── components/       # Reusable components
├── hooks/           # Custom React hooks
├── lib/             # Utilities and helpers
├── services/        # API client services
├── store/           # Zustand stores
└── styles/          # Global styles
```

### Backend Structure
```
backend/
├── cmd/             # Application entry points
├── internal/
│   ├── handlers/    # HTTP handlers
│   ├── services/    # Business logic
│   ├── models/      # Data models
│   ├── middleware/  # HTTP middleware
│   └── db/          # Database setup
├── migrations/      # Database migrations
└── main.go          # Entry point
```

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgres://interviewos:interviewos_dev@localhost:5432/interviewos
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key-change-in-production
OPENAI_API_KEY=your-api-key
PORT=8080
ENV=development
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_WS_URL=ws://localhost:8080
```

## Common Development Tasks

### Add a new API endpoint
1. Create handler in `backend/internal/handlers/`
2. Add route in `backend/main.go`
3. Create API service in `frontend/services/`
4. Use in component with React Query

### Add a new page
1. Create folder in `frontend/app/`
2. Add `page.tsx`
3. Optionally add `layout.tsx` for page layout

### Add database migration
1. Create `.sql` file in `backend/migrations/`
2. Run migrations on backend startup

### WebSocket communication
- Client emits event: `socket.emit('event-name', data)`
- Server listens: Handler defined in `internal/handlers/websocket.go`
- Server broadcasts: `broadcast()` function

## Testing
- Frontend: Jest + React Testing Library
- Backend: Go's built-in testing package
- Integration: Postman collection included

## Deployment
- Frontend: Vercel
- Backend: AWS EC2/ECS
- Database: AWS RDS PostgreSQL
- Cache: AWS ElastiCache Redis

## Troubleshooting

### Database connection issues
- Check `DATABASE_URL` format
- Verify PostgreSQL is running
- Run migrations: `cd backend && go run main.go`

### Frontend can't reach backend
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check backend is running on port 8080
- Check CORS settings in backend

### WebSocket connection fails
- Verify `NEXT_PUBLIC_WS_URL` is correct
- Check WebSocket handler in backend
- Verify Socket.IO is initialized in frontend

## Git Workflow
1. Create feature branch: `git checkout -b feature/name`
2. Make changes and commit
3. Push: `git push origin feature/name`
4. Create Pull Request

## Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Go Documentation](https://golang.org/doc/)
- [Fiber Framework](https://docs.gofiber.io/)
- [WebRTC Documentation](https://webrtc.org/getting-started/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
