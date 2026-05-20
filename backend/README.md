# InterviewOS Backend Development

## Getting Started

### Prerequisites

- Go 1.21+
- PostgreSQL 14+
- Redis 7+
- Docker (optional, for running services)

### Installation

```bash
go mod download
```

### Running the Server

```bash
go run main.go
```

The server will start on `http://localhost:8080` by default.

## Project Structure

```
backend/
├── cmd/               # Application entry points
├── internal/
│   ├── handlers/      # HTTP request handlers
│   │   ├── auth.go
│   │   ├── interview.go
│   │   ├── room.go
│   │   └── health.go
│   ├── models/        # Data models
│   │   └── models.go
│   ├── services/      # Business logic
│   ├── middleware/    # HTTP middleware
│   │   └── auth.go
│   └── db/            # Database setup
│       ├── database.go
│       └── redis.go
├── migrations/        # Database migrations
└── main.go           # Application entry point
```

## Environment Variables

Create `.env` file in backend directory:

```
DATABASE_URL=postgres://interviewos:interviewos_dev@localhost:5432/interviewos
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key-change-in-production
OPENAI_API_KEY=your-openai-api-key
PORT=8080
ENV=development
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout (requires auth)
- `GET /api/auth/me` - Get current user (requires auth)

### Interviews
- `GET /api/interviews` - List interviews (requires auth)
- `POST /api/interviews` - Create interview (requires auth)
- `GET /api/interviews/:id` - Get interview details
- `PUT /api/interviews/:id` - Update interview (requires auth)
- `DELETE /api/interviews/:id` - Delete interview (requires auth)

### Rooms
- `GET /api/rooms/:id` - Get room details
- `POST /api/rooms/join` - Join interview room
- `POST /api/rooms/:id/leave` - Leave interview room (requires auth)

## Database Schema

The backend uses GORM ORM for database operations. Key tables:

- `users` - User accounts
- `interviews` - Interview sessions
- `interview_rooms` - Secure interview rooms
- `feedback` - Interview feedback
- `code_sessions` - Collaborative coding sessions

See `migrations/001_init.sql` for full schema.

## WebSocket Events (Future Implementation)

The backend will support WebSocket signaling for WebRTC:

- `room:join` - Join room
- `room:leave` - Leave room
- `code:update` - Code update
- `chat:message` - Chat message
- `participant:mute` - Participant mute/unmute

## Key Dependencies

- **Fiber** - Web framework
- **GORM** - ORM for database operations
- **PostgreSQL** - Primary database driver
- **Redis** - Caching and session management
- **JWT** - Token-based authentication
- **bcrypt** - Password hashing
- **Go-Gorilla/WebSocket** - WebSocket support

## Development Tips

### Adding a New Endpoint

1. Create handler in `internal/handlers/`
2. Add route in `main.go`
3. Add middleware if needed in `internal/middleware/`
4. Test with curl or Postman

### Database Migrations

The database automatically migrates on startup via GORM's `AutoMigrate()`. For manual SQL migrations, add `.sql` files to `migrations/` directory.

### Error Handling

All endpoints return JSON responses:

```json
{
  "message": "error message"
}
```

Success responses return the data directly.

## Testing

Run tests with:

```bash
go test ./...
```

## Deployment

### Using Docker

```bash
docker build -t interviewos-backend .
docker run -p 8080:8080 --env-file .env interviewos-backend
```

### Environment for Production

- Use strong `JWT_SECRET`
- Set `ENV=production`
- Use managed PostgreSQL (AWS RDS)
- Use managed Redis (AWS ElastiCache)
- Use HTTPS/TLS
- Set up proper CORS

## Security Considerations

- ✅ JWT authentication
- ✅ Password hashing with bcrypt
- ✅ CORS middleware
- ✅ SQL injection protection (GORM)
- ✅ Rate limiting (TODO)
- ✅ API key validation (TODO)
- ✅ Audit logging (TODO)

## Performance Optimization

- Redis caching for frequently accessed data
- Database indexes on frequently queried columns
- Connection pooling for database
- WebSocket connections for real-time communication

## Troubleshooting

### Database Connection Error
- Verify `DATABASE_URL` format
- Ensure PostgreSQL is running
- Check database credentials

### Redis Connection Error
- Verify `REDIS_URL` format
- Ensure Redis is running

### JWT Token Invalid
- Check `JWT_SECRET` matches frontend
- Verify token hasn't expired
- Check token format in Authorization header
