-- DHStx AI Agent System Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Agent execution logs table
CREATE TABLE IF NOT EXISTS agent_executions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID NOT NULL,
  agent_id VARCHAR(50) NOT NULL,
  agent_name VARCHAR(100) NOT NULL,
  user_message TEXT NOT NULL,
  agent_response TEXT NOT NULL,
  model_used VARCHAR(50),
  provider VARCHAR(20),
  tokens_used INTEGER DEFAULT 0,
  execution_time_ms INTEGER DEFAULT 0,
  success BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_agent_executions_user_id ON agent_executions(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_executions_session_id ON agent_executions(session_id);
CREATE INDEX IF NOT EXISTS idx_agent_executions_agent_id ON agent_executions(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_executions_created_at ON agent_executions(created_at DESC);

-- Conversation sessions table
CREATE TABLE IF NOT EXISTS conversation_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) DEFAULT 'New Conversation',
  last_agent_id VARCHAR(50),
  message_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_conversation_sessions_user_id ON conversation_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_conversation_sessions_updated_at ON conversation_sessions(updated_at DESC);

-- Agent performance metrics table (aggregated daily)
CREATE TABLE IF NOT EXISTS agent_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  total_executions INTEGER DEFAULT 0,
  successful_executions INTEGER DEFAULT 0,
  failed_executions INTEGER DEFAULT 0,
  avg_response_time_ms INTEGER DEFAULT 0,
  total_tokens_used INTEGER DEFAULT 0,
  unique_users INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(agent_id, date)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_agent_metrics_agent_id ON agent_metrics(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_metrics_date ON agent_metrics(date DESC);

-- User feedback table
CREATE TABLE IF NOT EXISTS agent_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  execution_id UUID REFERENCES agent_executions(id) ON DELETE CASCADE,
  agent_id VARCHAR(50) NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_agent_feedback_agent_id ON agent_feedback(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_feedback_user_id ON agent_feedback(user_id);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE agent_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_feedback ENABLE ROW LEVEL SECURITY;

-- Agent executions: Users can only see their own executions
CREATE POLICY "Users can view their own agent executions"
  ON agent_executions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own agent executions"
  ON agent_executions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Conversation sessions: Users can only see their own sessions
CREATE POLICY "Users can view their own conversation sessions"
  ON conversation_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own conversation sessions"
  ON conversation_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversation sessions"
  ON conversation_sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own conversation sessions"
  ON conversation_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- Agent metrics: Read-only for all authenticated users
CREATE POLICY "Authenticated users can view agent metrics"
  ON agent_metrics FOR SELECT
  TO authenticated
  USING (true);

-- Agent feedback: Users can only see and manage their own feedback
CREATE POLICY "Users can view their own feedback"
  ON agent_feedback FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own feedback"
  ON agent_feedback FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own feedback"
  ON agent_feedback FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own feedback"
  ON agent_feedback FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update agent metrics (called by a cron job or trigger)
CREATE OR REPLACE FUNCTION update_agent_metrics()
RETURNS void AS $$
BEGIN
  INSERT INTO agent_metrics (
    agent_id,
    date,
    total_executions,
    successful_executions,
    failed_executions,
    avg_response_time_ms,
    total_tokens_used,
    unique_users
  )
  SELECT
    agent_id,
    CURRENT_DATE,
    COUNT(*) as total_executions,
    COUNT(*) FILTER (WHERE success = true) as successful_executions,
    COUNT(*) FILTER (WHERE success = false) as failed_executions,
    AVG(execution_time_ms)::INTEGER as avg_response_time_ms,
    SUM(tokens_used) as total_tokens_used,
    COUNT(DISTINCT user_id) as unique_users
  FROM agent_executions
  WHERE DATE(created_at) = CURRENT_DATE
  GROUP BY agent_id
  ON CONFLICT (agent_id, date)
  DO UPDATE SET
    total_executions = EXCLUDED.total_executions,
    successful_executions = EXCLUDED.successful_executions,
    failed_executions = EXCLUDED.failed_executions,
    avg_response_time_ms = EXCLUDED.avg_response_time_ms,
    total_tokens_used = EXCLUDED.total_tokens_used,
    unique_users = EXCLUDED.unique_users,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to automatically update session updated_at timestamp
CREATE OR REPLACE FUNCTION update_session_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update session timestamp
CREATE TRIGGER update_conversation_sessions_timestamp
  BEFORE UPDATE ON conversation_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_session_timestamp();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'DHStx AI Agent database schema created successfully!';
  RAISE NOTICE 'Tables created: agent_executions, conversation_sessions, agent_metrics, agent_feedback';
  RAISE NOTICE 'RLS policies enabled for all tables';
  RAISE NOTICE 'You can now start using the agent system';
END $$;

