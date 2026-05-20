# Changelog

All notable changes to this project will be documented in this file.

## [0.1.0] - 2024-01-20

### Added

**Frontend**
- User authentication (signup/login)
- Dashboard with interview statistics
- Interview scheduling form
- Secure interview rooms with WebRTC
- Video/audio communication with Simple-Peer
- Audio/video toggle controls
- Responsive UI with Tailwind CSS and shadcn/ui
- Zustand for state management
- Axios for API communication
- React Hot Toast for notifications

**Backend**
- User authentication with JWT
- Interview management (CRUD)
- Interview room creation and joining
- PostgreSQL database integration
- Redis caching support
- GORM ORM for database operations
- Fiber web framework
- CORS middleware
- Auth middleware

**Infrastructure**
- Docker Compose for local development
- Docker configuration for frontend and backend
- Database migrations with GORM
- Environment configuration

### Planned

**Phase 2 Features**
- Real-time collaborative code editor (Yjs)
- Live chat and messaging
- Interviewer notes and annotations
- WebSocket signaling server
- Interview recording
- Transcription service
- AI-generated interview summaries

**Phase 3 Features**
- ATS integrations (Greenhouse, Lever, etc.)
- Analytics dashboard
- Anti-cheating tools
- Enterprise features
- OAuth/SSO authentication
- Mobile application

## Future Roadmap

### Q1 2024
- [ ] Collaborative code editor
- [ ] Live chat implementation
- [ ] WebSocket signaling
- [ ] Interview recording

### Q2 2024
- [ ] AI summaries with OpenAI
- [ ] Transcription service
- [ ] Analytics dashboard
- [ ] Mobile app beta

### Q3 2024
- [ ] ATS integrations
- [ ] Enterprise features
- [ ] Custom branding
- [ ] Advanced security features

### Q4 2024
- [ ] Multi-language support
- [ ] Advanced scheduling
- [ ] Integration marketplace
- [ ] API for third-party developers
