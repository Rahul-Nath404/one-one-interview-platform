# InterviewOS API Documentation

Complete API reference for InterviewOS backend.

## Base URL

```
http://localhost:8080
```

## Authentication

All protected endpoints require an `Authorization` header with a Bearer token:

```
Authorization: Bearer <token>
```

## Response Format

### Success Response

```json
{
  "id": "string",
  "email": "string",
  ...
}
```

### Error Response

```json
{
  "message": "error description",
  "code": "error_code"
}
```

## Endpoints

### Authentication

#### Register

```
POST /api/auth/register
```

Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "secure_password",
  "name": "John Doe"
}
```

**Response:** `201 Created`
```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "candidate",
    "createdAt": "2024-01-20T10:30:00Z"
  }
}
```

#### Login

```
POST /api/auth/login
```

Authenticate user and get token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "secure_password"
}
```

**Response:** `200 OK`
```json
{
  "token": "eyJhbGc...",
  "user": { ... }
}
```

#### Get Current User

```
GET /api/auth/me
```

Get authenticated user information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "candidate",
  "avatar": null,
  "createdAt": "2024-01-20T10:30:00Z",
  "updatedAt": "2024-01-20T10:30:00Z"
}
```

#### Logout

```
POST /api/auth/logout
```

Logout user (token invalidation).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "message": "logged out successfully"
}
```

### Interviews

#### List Interviews

```
GET /api/interviews
```

Get all interviews for authenticated user (as host or candidate).

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (optional): Filter by status (scheduled, in-progress, completed, cancelled)
- `limit` (optional): Limit results (default: 50)
- `offset` (optional): Pagination offset (default: 0)

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "title": "Senior Developer Round 1",
    "description": "Technical interview",
    "scheduledAt": "2024-01-25T14:00:00Z",
    "duration": 60,
    "roomId": "uuid",
    "hostId": "uuid",
    "candidateId": "uuid",
    "status": "scheduled",
    "createdAt": "2024-01-20T10:30:00Z",
    "updatedAt": "2024-01-20T10:30:00Z"
  }
]
```

#### Create Interview

```
POST /api/interviews
```

Schedule a new interview.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Senior Developer Round 1",
  "description": "Technical interview for backend position",
  "scheduledAt": "2024-01-25T14:00:00Z",
  "duration": 60,
  "candidateId": "candidate-uuid"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "title": "Senior Developer Round 1",
  "description": "Technical interview",
  "scheduledAt": "2024-01-25T14:00:00Z",
  "duration": 60,
  "roomId": "uuid",
  "hostId": "current-user-uuid",
  "candidateId": "candidate-uuid",
  "status": "scheduled",
  "createdAt": "2024-01-20T10:30:00Z",
  "updatedAt": "2024-01-20T10:30:00Z"
}
```

#### Get Interview

```
GET /api/interviews/:id
```

Get interview details.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "title": "Senior Developer Round 1",
  "description": "Technical interview",
  "scheduledAt": "2024-01-25T14:00:00Z",
  "duration": 60,
  "roomId": "uuid",
  "hostId": "uuid",
  "candidateId": "uuid",
  "status": "scheduled",
  "host": { ... },
  "candidate": { ... },
  "room": { ... },
  "createdAt": "2024-01-20T10:30:00Z",
  "updatedAt": "2024-01-20T10:30:00Z"
}
```

#### Update Interview

```
PUT /api/interviews/:id
```

Update interview details (host only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Senior Developer Round 1 - Updated",
  "description": "Updated description",
  "scheduledAt": "2024-01-26T14:00:00Z",
  "duration": 75
}
```

**Response:** `200 OK`
```json
{ ... updated interview ... }
```

#### Delete Interview

```
DELETE /api/interviews/:id
```

Cancel interview (host only).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "message": "interview deleted successfully"
}
```

### Rooms

#### Get Room

```
GET /api/rooms/:id
```

Get interview room details.

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "interviewId": "uuid",
  "password": "123456",
  "rtcToken": "token",
  "interview": { ... },
  "createdAt": "2024-01-20T10:30:00Z",
  "updatedAt": "2024-01-20T10:30:00Z"
}
```

#### Join Room

```
POST /api/rooms/join
```

Join an interview room (password protected).

**Request Body:**
```json
{
  "roomId": "uuid",
  "password": "123456"
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "interviewId": "uuid",
  "password": "123456",
  "rtcToken": "token",
  "interview": { ... },
  "createdAt": "2024-01-20T10:30:00Z"
}
```

**Error Response:** `401 Unauthorized`
```json
{
  "message": "invalid room password"
}
```

#### Leave Room

```
POST /api/rooms/:id/leave
```

Leave interview room.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "message": "left room successfully"
}
```

## Error Codes

| Code | Message | Status |
|------|---------|--------|
| `INVALID_CREDENTIALS` | Invalid email or password | 401 |
| `UNAUTHORIZED` | Missing or invalid token | 401 |
| `FORBIDDEN` | Not authorized for this operation | 403 |
| `NOT_FOUND` | Resource not found | 404 |
| `CONFLICT` | Email already registered | 409 |
| `INVALID_REQUEST` | Invalid request body | 400 |
| `INTERNAL_ERROR` | Server error | 500 |

## Rate Limiting

Currently no rate limiting. Will be added in future releases.

## WebSocket Events

### Planned Events

Server will support WebSocket connections at `ws://localhost:8080` for real-time signaling.

**Client → Server:**
```
room:join - Join interview room
room:leave - Leave interview room
code:update - Update code
chat:message - Send chat message
participant:mute - Mute participant
```

**Server → Client:**
```
room:participant-joined - New participant
room:participant-left - Participant left
code:update - Code updated
chat:new-message - New message
signal - WebRTC signal
```

## Examples

### cURL Examples

#### Register
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password",
    "name": "John Doe"
  }'
```

#### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password"
  }'
```

#### Create Interview
```bash
curl -X POST http://localhost:8080/api/interviews \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Interview",
    "description": "Test",
    "scheduledAt": "2024-01-25T14:00:00Z",
    "duration": 60,
    "candidateId": "candidate-uuid"
  }'
```

### JavaScript Examples

#### Fetch Examples

```javascript
// Register
const registerResponse = await fetch('http://localhost:8080/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password',
    name: 'John Doe'
  })
});
const { token, user } = await registerResponse.json();
localStorage.setItem('token', token);

// Get Current User
const userResponse = await fetch('http://localhost:8080/api/auth/me', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const currentUser = await userResponse.json();
```

## Pagination

Endpoints that return lists support pagination via query parameters:

```
GET /api/interviews?limit=20&offset=0
```

**Recommended Defaults:**
- `limit`: 50 (max: 100)
- `offset`: 0

## Versioning

Current version: `v1`

Future API versions will be at `/api/v2/`, etc.

## Rate Limits

**Planned for future releases:**
- 1000 requests per hour per IP
- 100 requests per minute for authenticated users

## Support

For API issues or questions:
- GitHub Issues: Report bugs
- GitHub Discussions: Ask questions
- Email: support@interviewos.com
