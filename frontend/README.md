# InterviewOS Frontend Development

## Getting Started

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

- `app/` - Next.js app router pages and layouts
- `components/` - React components
  - `ui/` - Base UI components (Button, Input, Card, etc.)
  - `InterviewRoom.tsx` - Video interview room component with WebRTC
- `hooks/` - Custom React hooks
- `lib/` - Utilities and helpers
  - `api.ts` - API client for backend communication
  - `types.ts` - TypeScript type definitions
  - `webrtc.ts` - WebRTC utilities for video/audio
- `services/` - API services
- `store/` - Zustand state management
  - `authStore.ts` - Authentication state
  - `interviewStore.ts` - Interview state
- `styles/` - Global CSS and Tailwind configuration

## Features Implemented

### Phase 1 - MVP
- [x] User Authentication (Signup/Login)
- [x] Dashboard with user info
- [x] Interview scheduling form
- [x] Secure interview rooms with WebRTC
- [x] Video/Audio communication
- [x] Audio/Video toggle controls
- [x] Room join/leave functionality
- [ ] Collaborative code editor
- [ ] Live chat
- [ ] Interviewer notes

### Environment Variables

Create `.env.local` file:

```
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_WS_URL=ws://localhost:8080
```

## Key Dependencies

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **TanStack Query** - Server state
- **Socket.IO** - Real-time communication
- **Simple-Peer** - WebRTC wrapper
- **Axios** - HTTP client
- **React Hot Toast** - Notifications

## API Integration

The frontend communicates with the backend API at `NEXT_PUBLIC_API_URL`:

- **Auth**: `/api/auth/register`, `/api/auth/login`, `/api/auth/me`
- **Interviews**: `/api/interviews` (GET, POST, PUT, DELETE)
- **Rooms**: `/api/rooms/:id`, `/api/rooms/join`

## WebRTC Video Room

The `InterviewRoom` component handles:
- Local media stream capture (audio/video)
- WebRTC peer connections via Simple-Peer
- Socket.IO signaling with the server
- Audio/video toggle controls
- Participant management

### Usage

```tsx
import { InterviewRoom } from '@/components/InterviewRoom'

<InterviewRoom roomId="room-123" interviewId="interview-456" />
```

## Development Tips

- Use `useAuthStore()` to access user auth state
- Use `useInterviewStore()` to manage interview state
- API requests automatically include JWT token from localStorage
- Check browser console for WebRTC connection status
- Use React Hot Toast for user notifications

## Deployment

- Frontend deploys to Vercel
- Set environment variables in Vercel dashboard
- Automatic deployment on git push to main branch

## Troubleshooting

### Camera/Microphone not working
- Check browser permissions for camera/microphone
- Ensure HTTPS is used (required for getUserMedia)
- Check WebRTC console logs

### Can't connect to backend
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check backend is running on port 8080
- Check CORS headers in backend

### Socket.IO connection fails
- Verify `NEXT_PUBLIC_WS_URL` is correct
- Check WebSocket support in network tab
- Enable Socket.IO debugging in browser console
