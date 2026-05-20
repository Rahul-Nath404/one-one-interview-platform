-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'candidate',
  avatar TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create interviews table
CREATE TABLE IF NOT EXISTS interviews (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  scheduled_at TIMESTAMP,
  duration INTEGER,
  room_id VARCHAR(36),
  host_id VARCHAR(36) NOT NULL,
  candidate_id VARCHAR(36) NOT NULL,
  status VARCHAR(50) DEFAULT 'scheduled',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (host_id) REFERENCES users(id),
  FOREIGN KEY (candidate_id) REFERENCES users(id)
);

-- Create interview_rooms table
CREATE TABLE IF NOT EXISTS interview_rooms (
  id VARCHAR(36) PRIMARY KEY,
  interview_id VARCHAR(36) NOT NULL,
  password VARCHAR(50),
  rtc_token TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (interview_id) REFERENCES interviews(id)
);

-- Create feedback table
CREATE TABLE IF NOT EXISTS feedbacks (
  id VARCHAR(36) PRIMARY KEY,
  interview_id VARCHAR(36) NOT NULL,
  rating INTEGER,
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (interview_id) REFERENCES interviews(id)
);

-- Create code_sessions table
CREATE TABLE IF NOT EXISTS code_sessions (
  id VARCHAR(36) PRIMARY KEY,
  interview_id VARCHAR(36) NOT NULL,
  language VARCHAR(50),
  code TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (interview_id) REFERENCES interviews(id)
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_interviews_host_id ON interviews(host_id);
CREATE INDEX idx_interviews_candidate_id ON interviews(candidate_id);
CREATE INDEX idx_interviews_status ON interviews(status);
CREATE INDEX idx_interview_rooms_interview_id ON interview_rooms(interview_id);
CREATE INDEX idx_feedbacks_interview_id ON feedbacks(interview_id);
CREATE INDEX idx_code_sessions_interview_id ON code_sessions(interview_id);
