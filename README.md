# InterviewOS

A browser-based interview platform enabling recruiters, interviewers, and candidates to conduct secure and collaborative interviews with scheduling, WebRTC video/audio communication, collaborative coding environments, and AI-powered evaluation tools.

## Tech Stack

### Frontend
- **Next.js 14** - React framework with TypeScript
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Accessible UI components
- **Zustand** - State management
- **TanStack Query** - Server state management
- **Socket.IO Client** - WebSocket communication
- **Simple-Peer** - WebRTC wrapper

### Backend
- **Go** - Backend language
- **Fiber** - Web framework
- **PostgreSQL** - Primary database
- **Redis** - Caching and session management
- **GORM** - ORM for database operations
- **JWT** - Authentication tokens
- **WebSocket** - Real-time communication
- **OpenAI** - AI-powered summaries

### Infrastructure
- **Docker & Docker Compose** - Containerization
- **AWS** - Cloud infrastructure
- **Vercel** - Frontend hosting
- **Cloudflare** - CDN and security

## Project Structure

```
interview_help/
├── frontend/              # Next.js frontend application
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── styles/
│   └── package.json
├── backend/               # Go backend services
│   ├── cmd/
│   ├── internal/
│   │   ├── handlers/
│   │   ├── services/
│   │   ├── models/
│   │   ├── middleware/
│   │   └── db/
│   ├── migrations/
│   ├── main.go
│   └── go.mod
├── shared/                # Shared types and utilities
│── docker-compose.yml     # Local development environment
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- Go 1.21+
- Docker & Docker Compose
- PostgreSQL 14+
- Redis 7+

### Installation

#### Option 1: Using Docker Compose (Recommended)
```bash
docker-compose up
```

This will start:
- PostgreSQL database
- Redis cache
- Backend API (http://localhost:8080)
- Frontend (http://localhost:3000)

#### Option 2: Manual Setup

**Backend:**
```bash
cd backend
go mod download
go run main.go
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgres://user:password@localhost:5432/interviewos
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
OPENAI_API_KEY=your-openai-key
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_WS_URL=ws://localhost:8080
```

## Features

### MVP (Phase 1)
- [x] User authentication (email/password)
- [x] Interview scheduling
- [x] Secure interview rooms with WebRTC
- [x] Video/audio communication
- [x] Collaborative code editor
- [ ] Live chat
- [ ] Interviewer notes

### Phase 2
- [ ] AI-generated summaries
- [ ] Analytics dashboard
- [ ] Interview recording
- [ ] Transcription service

### Phase 3
- [ ] ATS integrations
- [ ] Enterprise features
- [ ] Anti-cheating tools
- [ ] Custom branding

## API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - User logout

### Interviews
- `GET /api/interviews` - List interviews
- `POST /api/interviews` - Create interview
- `GET /api/interviews/:id` - Get interview details
- `PUT /api/interviews/:id` - Update interview
- `DELETE /api/interviews/:id` - Cancel interview

### Rooms
- `POST /api/rooms/join` - Join interview room
- `GET /api/rooms/:id` - Get room details

## WebSocket Events

### Client → Server
- `room:join` - Join interview room
- `code:update` - Update collaborative code
- `chat:message` - Send chat message
- `participant:mute` - Mute audio

### Server → Client
- `room:participant-joined` - Participant joined
- `room:participant-left` - Participant left
- `code:update` - Code updated by another participant
- `chat:new-message` - New chat message

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please open a GitHub issue or contact support@interviewos.com
