-- User Integrations Table
-- Stores which integrations each user has connected

CREATE TABLE IF NOT EXISTS user_integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  integration_id TEXT NOT NULL,
  status TEXT DEFAULT 'connected' CHECK (status IN ('connected', 'disconnected', 'error')),
  credentials JSONB,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, integration_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_integrations_user_id ON user_integrations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_integrations_status ON user_integrations(status);
CREATE INDEX IF NOT EXISTS idx_user_integrations_integration_id ON user_integrations(integration_id);

-- Row Level Security
ALTER TABLE user_integrations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own integrations
CREATE POLICY user_integrations_select_policy ON user_integrations
  FOR SELECT
  USING (auth.uid()::text = user_id);

-- Policy: Users can only insert their own integrations
CREATE POLICY user_integrations_insert_policy ON user_integrations
  FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

-- Policy: Users can only update their own integrations
CREATE POLICY user_integrations_update_policy ON user_integrations
  FOR UPDATE
  USING (auth.uid()::text = user_id);

-- Policy: Users can only delete their own integrations
CREATE POLICY user_integrations_delete_policy ON user_integrations
  FOR DELETE
  USING (auth.uid()::text = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_user_integrations_updated_at
  BEFORE UPDATE ON user_integrations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Sample data for testing (optional)
-- INSERT INTO user_integrations (user_id, integration_id, status, metadata) VALUES
--   ('test-user-123', 'taskade', 'connected', '{"connected_at": "2025-01-01T00:00:00Z"}'),
--   ('test-user-123', 'notion', 'connected', '{"connected_at": "2025-01-01T00:00:00Z"}'),
--   ('test-user-123', 'invideo', 'connected', '{"connected_at": "2025-01-01T00:00:00Z"}');
