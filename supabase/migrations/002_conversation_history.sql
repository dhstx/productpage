-- Conversation History System
-- Stores chat conversations, messages, and bookmarks

-- Conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  agent_id TEXT NOT NULL,
  agent_name TEXT NOT NULL,
  is_bookmarked BOOLEAN DEFAULT FALSE,
  is_archived BOOLEAN DEFAULT FALSE,
  total_pt_cost INTEGER DEFAULT 0,
  message_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  pt_cost INTEGER DEFAULT 0,
  model_used TEXT,
  tokens_used INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversation tags table
CREATE TABLE IF NOT EXISTS conversation_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(conversation_id, tag)
);

-- Conversation shares table (for sharing conversations)
CREATE TABLE IF NOT EXISTS conversation_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  share_code TEXT UNIQUE NOT NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  expires_at TIMESTAMP WITH TIME ZONE,
  view_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON conversations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_bookmarked ON conversations(user_id, is_bookmarked) WHERE is_bookmarked = TRUE;
CREATE INDEX IF NOT EXISTS idx_conversations_archived ON conversations(user_id, is_archived);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_conversation_tags_conversation_id ON conversation_tags(conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversation_tags_tag ON conversation_tags(tag);
CREATE INDEX IF NOT EXISTS idx_conversation_shares_code ON conversation_shares(share_code);

-- Full-text search index on conversation titles
CREATE INDEX IF NOT EXISTS idx_conversations_title_search ON conversations USING gin(to_tsvector('english', title));

-- Full-text search index on message content
CREATE INDEX IF NOT EXISTS idx_messages_content_search ON messages USING gin(to_tsvector('english', content));

-- Function to update conversation updated_at timestamp
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET updated_at = NOW(),
      last_message_at = NOW(),
      message_count = (SELECT COUNT(*) FROM messages WHERE conversation_id = NEW.conversation_id)
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update conversation timestamp when message is added
DROP TRIGGER IF EXISTS trigger_update_conversation_timestamp ON messages;
CREATE TRIGGER trigger_update_conversation_timestamp
AFTER INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION update_conversation_timestamp();

-- Function to auto-generate conversation title from first message
CREATE OR REPLACE FUNCTION generate_conversation_title()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role = 'user' AND (SELECT title FROM conversations WHERE id = NEW.conversation_id) IS NULL THEN
    UPDATE conversations
    SET title = LEFT(NEW.content, 50) || CASE WHEN LENGTH(NEW.content) > 50 THEN '...' ELSE '' END
    WHERE id = NEW.conversation_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate title
DROP TRIGGER IF EXISTS trigger_generate_conversation_title ON messages;
CREATE TRIGGER trigger_generate_conversation_title
AFTER INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION generate_conversation_title();

-- Function to update conversation PT cost
CREATE OR REPLACE FUNCTION update_conversation_pt_cost()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET total_pt_cost = (SELECT COALESCE(SUM(pt_cost), 0) FROM messages WHERE conversation_id = NEW.conversation_id)
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update PT cost
DROP TRIGGER IF EXISTS trigger_update_conversation_pt_cost ON messages;
CREATE TRIGGER trigger_update_conversation_pt_cost
AFTER INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION update_conversation_pt_cost();

-- Function to search conversations
CREATE OR REPLACE FUNCTION search_conversations(
  p_user_id UUID,
  p_query TEXT,
  p_agent_id TEXT DEFAULT NULL,
  p_bookmarked_only BOOLEAN DEFAULT FALSE,
  p_limit INTEGER DEFAULT 50,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  agent_id TEXT,
  agent_name TEXT,
  is_bookmarked BOOLEAN,
  total_pt_cost INTEGER,
  message_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE,
  last_message_at TIMESTAMP WITH TIME ZONE,
  relevance REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.title,
    c.agent_id,
    c.agent_name,
    c.is_bookmarked,
    c.total_pt_cost,
    c.message_count,
    c.created_at,
    c.last_message_at,
    ts_rank(to_tsvector('english', c.title), plainto_tsquery('english', p_query)) AS relevance
  FROM conversations c
  WHERE c.user_id = p_user_id
    AND c.is_archived = FALSE
    AND (p_query IS NULL OR to_tsvector('english', c.title) @@ plainto_tsquery('english', p_query))
    AND (p_agent_id IS NULL OR c.agent_id = p_agent_id)
    AND (p_bookmarked_only = FALSE OR c.is_bookmarked = TRUE)
  ORDER BY 
    CASE WHEN p_query IS NOT NULL THEN relevance ELSE 0 END DESC,
    c.last_message_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

-- Function to get conversation statistics
CREATE OR REPLACE FUNCTION get_conversation_stats(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_conversations', COUNT(*),
    'bookmarked_conversations', COUNT(*) FILTER (WHERE is_bookmarked = TRUE),
    'archived_conversations', COUNT(*) FILTER (WHERE is_archived = TRUE),
    'total_messages', COALESCE(SUM(message_count), 0),
    'total_pt_spent', COALESCE(SUM(total_pt_cost), 0),
    'agents_used', COUNT(DISTINCT agent_id),
    'avg_messages_per_conversation', COALESCE(AVG(message_count), 0)
  ) INTO result
  FROM conversations
  WHERE user_id = p_user_id;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- RLS Policies
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_shares ENABLE ROW LEVEL SECURITY;

-- Conversations policies
CREATE POLICY "Users can view their own conversations"
  ON conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own conversations"
  ON conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversations"
  ON conversations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own conversations"
  ON conversations FOR DELETE
  USING (auth.uid() = user_id);

-- Messages policies
CREATE POLICY "Users can view messages in their conversations"
  ON messages FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM conversations
    WHERE conversations.id = messages.conversation_id
    AND conversations.user_id = auth.uid()
  ));

CREATE POLICY "Users can create messages in their conversations"
  ON messages FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM conversations
    WHERE conversations.id = messages.conversation_id
    AND conversations.user_id = auth.uid()
  ));

-- Tags policies
CREATE POLICY "Users can manage tags on their conversations"
  ON conversation_tags FOR ALL
  USING (EXISTS (
    SELECT 1 FROM conversations
    WHERE conversations.id = conversation_tags.conversation_id
    AND conversations.user_id = auth.uid()
  ));

-- Shares policies
CREATE POLICY "Users can create shares for their conversations"
  ON conversation_shares FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can view their own shares"
  ON conversation_shares FOR SELECT
  USING (auth.uid() = created_by);

CREATE POLICY "Anyone can view active shared conversations"
  ON conversation_shares FOR SELECT
  USING (is_active = TRUE AND (expires_at IS NULL OR expires_at > NOW()));

-- Grant permissions
GRANT ALL ON conversations TO authenticated;
GRANT ALL ON messages TO authenticated;
GRANT ALL ON conversation_tags TO authenticated;
GRANT ALL ON conversation_shares TO authenticated;

-- Comments
COMMENT ON TABLE conversations IS 'Stores user chat conversations with agents';
COMMENT ON TABLE messages IS 'Stores individual messages within conversations';
COMMENT ON TABLE conversation_tags IS 'Tags for organizing conversations';
COMMENT ON TABLE conversation_shares IS 'Shareable links for conversations';
COMMENT ON FUNCTION search_conversations IS 'Full-text search across conversations';
COMMENT ON FUNCTION get_conversation_stats IS 'Get aggregate statistics for user conversations';

