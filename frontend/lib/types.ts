// User types
export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'recruiter' | 'interviewer' | 'candidate'
  avatar?: string
  createdAt: string
}

export interface AuthResponse {
  token: string
  user: User
}

// Interview types
export interface Interview {
  id: string
  title: string
  description: string
  scheduledAt: string
  duration: number
  roomId: string
  hostId: string
  candidateId: string
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
  createdAt: string
}

export interface InterviewRoom {
  id: string
  interviewId: string
  password: string
  rtcToken: string
  createdAt: string
}

// Feedback types
export interface Feedback {
  id: string
  interviewId: string
  rating: number
  comment: string
  createdAt: string
}

// API Error type
export interface ApiError {
  message: string
  code: string
  details?: any
}
