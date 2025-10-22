-- =====================================================
-- Token-Based Pricing System Database Migration
-- =====================================================
-- This migration adds token tracking, subscription tiers,
-- and usage analytics to support the pricing system.
-- =====================================================

-- 1. Add subscription columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS subscription_tier VARCHAR(20) DEFAULT 'free',
ADD COLUMN IF NOT EXISTS tokens_allocated INTEGER DEFAULT 100,
ADD COLUMN IF NOT EXISTS tokens_used INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS tokens_reset_date TIMESTAMP DEFAULT (NOW() + INTERVAL '1 month'),
ADD COLUMN IF NOT EXISTS billing_cycle_start TIMESTAMP DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS stripe_subscription_id VARCHAR(255);

-- 2. Create token usage tracking table
CREATE TABLE IF NOT EXISTS token_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_id VARCHAR(255),
  agent_id VARCHAR(50) NOT NULL,
  message TEXT,
  tokens_consumed INTEGER NOT NULL,
  input_tokens INTEGER NOT NULL,
  output_tokens INTEGER NOT NULL,
  cost_usd DECIMAL(10, 6) NOT NULL,
  model VARCHAR(50),
  response_time_ms INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Create subscription history table
CREATE TABLE IF NOT EXISTS subscription_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  tier VARCHAR(20) NOT NULL,
  tokens_allocated INTEGER NOT NULL,
  price_usd DECIMAL(10, 2) NOT NULL,
  billing_cycle_start TIMESTAMP NOT NULL,
  billing_cycle_end TIMESTAMP NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active', -- active, cancelled, expired, paused
  stripe_subscription_id VARCHAR(255),
  stripe_invoice_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. Create anonymous sessions table (for non-logged-in users)
CREATE TABLE IF NOT EXISTS anonymous_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id VARCHAR(255) UNIQUE NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  questions_asked INTEGER DEFAULT 0,
  last_question_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP DEFAULT (NOW() + INTERVAL '24 hours')
);

-- 5. Create token purchase add-ons table
CREATE TABLE IF NOT EXISTS token_purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  tokens_purchased INTEGER NOT NULL,
  price_usd DECIMAL(10, 2) NOT NULL,
  stripe_payment_intent_id VARCHAR(255),
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, completed, failed, refunded
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- 6. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_token_usage_user_id ON token_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_token_usage_created_at ON token_usage(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_token_usage_session_id ON token_usage(session_id);
CREATE INDEX IF NOT EXISTS idx_subscription_history_user_id ON subscription_history(user_id);
CREATE INDEX IF NOT EXISTS idx_subscription_history_status ON subscription_history(status);
CREATE INDEX IF NOT EXISTS idx_anonymous_sessions_session_id ON anonymous_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_anonymous_sessions_expires_at ON anonymous_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_token_purchases_user_id ON token_purchases(user_id);

-- 7. Create RLS (Row Level Security) policies
ALTER TABLE token_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE token_purchases ENABLE ROW LEVEL SECURITY;

-- Users can view their own token usage
CREATE POLICY IF NOT EXISTS "Users can view own token usage"
  ON token_usage FOR SELECT
  USING (auth.uid() = user_id);

-- Users can view their own subscription history
CREATE POLICY IF NOT EXISTS "Users can view own subscription history"
  ON subscription_history FOR SELECT
  USING (auth.uid() = user_id);

-- Users can view their own token purchases
CREATE POLICY IF NOT EXISTS "Users can view own token purchases"
  ON token_purchases FOR SELECT
  USING (auth.uid() = user_id);

-- Service role can insert/update all tables (for backend)
CREATE POLICY IF NOT EXISTS "Service role can manage token usage"
  ON token_usage FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY IF NOT EXISTS "Service role can manage subscription history"
  ON subscription_history FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY IF NOT EXISTS "Service role can manage token purchases"
  ON token_purchases FOR ALL
  USING (auth.role() = 'service_role');

-- 8. Create function to reset monthly tokens
CREATE OR REPLACE FUNCTION reset_monthly_tokens()
RETURNS void AS $$
BEGIN
  -- Reset tokens for users whose billing cycle has ended
  UPDATE users
  SET 
    tokens_used = 0,
    tokens_reset_date = tokens_reset_date + INTERVAL '1 month',
    billing_cycle_start = billing_cycle_start + INTERVAL '1 month'
  WHERE 
    tokens_reset_date <= NOW()
    AND subscription_tier != 'anonymous';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Create function to check token availability
CREATE OR REPLACE FUNCTION check_token_availability(
  p_user_id UUID,
  p_tokens_required INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
  v_tokens_allocated INTEGER;
  v_tokens_used INTEGER;
  v_tokens_available INTEGER;
BEGIN
  -- Get user's token allocation and usage
  SELECT tokens_allocated, tokens_used
  INTO v_tokens_allocated, v_tokens_used
  FROM users
  WHERE id = p_user_id;
  
  -- Calculate available tokens
  v_tokens_available := v_tokens_allocated - v_tokens_used;
  
  -- Return true if enough tokens available
  RETURN v_tokens_available >= p_tokens_required;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Create function to consume tokens
CREATE OR REPLACE FUNCTION consume_tokens(
  p_user_id UUID,
  p_tokens_consumed INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
  v_tokens_available INTEGER;
BEGIN
  -- Check if user has enough tokens
  IF NOT check_token_availability(p_user_id, p_tokens_consumed) THEN
    RETURN FALSE;
  END IF;
  
  -- Consume tokens
  UPDATE users
  SET tokens_used = tokens_used + p_tokens_consumed
  WHERE id = p_user_id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. Create function to get user token stats
CREATE OR REPLACE FUNCTION get_user_token_stats(p_user_id UUID)
RETURNS TABLE(
  allocated INTEGER,
  used INTEGER,
  remaining INTEGER,
  reset_date TIMESTAMP,
  tier VARCHAR(20)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    tokens_allocated,
    tokens_used,
    tokens_allocated - tokens_used AS remaining,
    tokens_reset_date,
    subscription_tier
  FROM users
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. Create function to clean up expired anonymous sessions
CREATE OR REPLACE FUNCTION cleanup_expired_anonymous_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM anonymous_sessions
  WHERE expires_at <= NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 13. Create view for usage analytics
CREATE OR REPLACE VIEW user_usage_analytics AS
SELECT 
  u.id AS user_id,
  u.email,
  u.subscription_tier,
  u.tokens_allocated,
  u.tokens_used,
  u.tokens_allocated - u.tokens_used AS tokens_remaining,
  ROUND((u.tokens_used::DECIMAL / NULLIF(u.tokens_allocated, 0)) * 100, 2) AS usage_percentage,
  COUNT(tu.id) AS total_requests,
  SUM(tu.tokens_consumed) AS total_tokens_consumed,
  SUM(tu.cost_usd) AS total_cost_usd,
  AVG(tu.response_time_ms) AS avg_response_time_ms,
  MAX(tu.created_at) AS last_request_at
FROM users u
LEFT JOIN token_usage tu ON u.id = tu.user_id
WHERE u.subscription_tier != 'anonymous'
GROUP BY u.id, u.email, u.subscription_tier, u.tokens_allocated, u.tokens_used;

-- 14. Create view for daily usage metrics
CREATE OR REPLACE VIEW daily_usage_metrics AS
SELECT 
  DATE(created_at) AS date,
  COUNT(DISTINCT user_id) AS unique_users,
  COUNT(*) AS total_requests,
  SUM(tokens_consumed) AS total_tokens,
  SUM(cost_usd) AS total_cost,
  AVG(response_time_ms) AS avg_response_time,
  COUNT(DISTINCT agent_id) AS agents_used
FROM token_usage
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- 15. Create view for agent popularity
CREATE OR REPLACE VIEW agent_popularity AS
SELECT 
  agent_id,
  COUNT(*) AS request_count,
  COUNT(DISTINCT user_id) AS unique_users,
  SUM(tokens_consumed) AS total_tokens,
  AVG(tokens_consumed) AS avg_tokens_per_request,
  SUM(cost_usd) AS total_cost,
  AVG(response_time_ms) AS avg_response_time
FROM token_usage
GROUP BY agent_id
ORDER BY request_count DESC;

-- 16. Insert default subscription tiers reference data
CREATE TABLE IF NOT EXISTS subscription_tiers (
  tier VARCHAR(20) PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  price_usd DECIMAL(10, 2) NOT NULL,
  tokens_allocated INTEGER NOT NULL,
  agent_access TEXT[] NOT NULL,
  features JSONB,
  display_order INTEGER NOT NULL
);

INSERT INTO subscription_tiers (tier, name, price_usd, tokens_allocated, agent_access, features, display_order)
VALUES 
  ('anonymous', 'Anonymous', 0.00, 0, ARRAY['commander', 'connector', 'conductor'], 
   '{"questions_limit": 1, "follow_ups": false, "history": false}'::jsonb, 0),
  ('free', 'Free Account', 0.00, 100, ARRAY['commander', 'connector', 'conductor'],
   '{"history": true, "basic_integrations": true}'::jsonb, 1),
  ('starter', 'Starter', 15.00, 500, ARRAY['commander', 'connector', 'conductor', 'scout', 'builder', 'muse', 'echo', 'archivist', 'ledger', 'counselor', 'sentinel', 'optimizer', 'orchestrator'],
   '{"all_agents": true, "history": true, "all_integrations": true, "priority_support": true}'::jsonb, 2),
  ('professional', 'Professional', 39.00, 1500, ARRAY['commander', 'connector', 'conductor', 'scout', 'builder', 'muse', 'echo', 'archivist', 'ledger', 'counselor', 'sentinel', 'optimizer', 'orchestrator'],
   '{"all_agents": true, "priority_queue": true, "analytics": true, "export": true, "api_access": true}'::jsonb, 3),
  ('business', 'Business', 99.00, 5000, ARRAY['commander', 'connector', 'conductor', 'scout', 'builder', 'muse', 'echo', 'archivist', 'ledger', 'counselor', 'sentinel', 'optimizer', 'orchestrator'],
   '{"all_agents": true, "team_collaboration": true, "custom_configs": true, "dedicated_support": true, "sla": true, "advanced_api": true}'::jsonb, 4),
  ('enterprise', 'Enterprise', 299.00, 10000, ARRAY['commander', 'connector', 'conductor', 'scout', 'builder', 'muse', 'echo', 'archivist', 'ledger', 'counselor', 'sentinel', 'optimizer', 'orchestrator'],
   '{"all_agents": true, "unlimited_team": true, "custom_development": true, "white_label": true, "dedicated_infra": true, "premium_support": true}'::jsonb, 5)
ON CONFLICT (tier) DO UPDATE SET
  name = EXCLUDED.name,
  price_usd = EXCLUDED.price_usd,
  tokens_allocated = EXCLUDED.tokens_allocated,
  agent_access = EXCLUDED.agent_access,
  features = EXCLUDED.features,
  display_order = EXCLUDED.display_order;

-- 17. Create trigger to update subscription_history updated_at
CREATE OR REPLACE FUNCTION update_subscription_history_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_subscription_history_timestamp
BEFORE UPDATE ON subscription_history
FOR EACH ROW
EXECUTE FUNCTION update_subscription_history_timestamp();

-- =====================================================
-- Migration Complete
-- =====================================================
-- Next steps:
-- 1. Run this migration in Supabase SQL Editor
-- 2. Set up cron job to run reset_monthly_tokens() daily
-- 3. Set up cron job to run cleanup_expired_anonymous_sessions() hourly
-- 4. Configure Stripe webhook to update subscription_history
-- 5. Test token consumption and tracking
-- =====================================================

