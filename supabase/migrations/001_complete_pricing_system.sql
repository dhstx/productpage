-- Complete Pricing System Database Schema
-- Version: 3.0 - Metered Advanced PT with Traffic-Light Monitoring
-- Date: 2025-10-22

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. SUBSCRIPTION TIERS TABLE (Updated with V3 Pricing)
-- ============================================================================

CREATE TABLE IF NOT EXISTS subscription_tiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tier VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  price_usd DECIMAL(10,2) NOT NULL,
  price_annual_usd DECIMAL(10,2),
  core_pt_allocated INTEGER NOT NULL,
  advanced_pt_allocated INTEGER NOT NULL DEFAULT 0,
  advanced_pt_metered BOOLEAN DEFAULT FALSE,
  agent_slots INTEGER NOT NULL DEFAULT 1,
  rate_limit_rpm INTEGER NOT NULL DEFAULT 2,
  rate_limit_rph INTEGER NOT NULL DEFAULT 60,
  concurrency_limit INTEGER NOT NULL DEFAULT 1,
  features JSONB DEFAULT '{}',
  display_order INTEGER NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert V3 pricing tiers
INSERT INTO subscription_tiers (tier, display_name, price_usd, price_annual_usd, core_pt_allocated, advanced_pt_allocated, advanced_pt_metered, agent_slots, rate_limit_rpm, rate_limit_rph, concurrency_limit, features, display_order) VALUES
('freemium', 'Freemium', 0.00, 0.00, 100, 0, FALSE, 1, 1, 30, 1, '{"model_access": "core_only", "advanced_blocked": true, "team_features": false}', 1),
('entry', 'Entry', 19.00, 193.00, 300, 0, TRUE, 5, 2, 60, 2, '{"model_access": "core_only", "advanced_addon": true, "team_features": false, "workflows": 3}', 2),
('pro', 'Professional', 49.00, 499.00, 700, 50, TRUE, 25, 4, 120, 4, '{"model_access": "core_advanced_metered", "advanced_soft_cap": 0.20, "advanced_hard_cap": 0.25, "team_features": "basic", "workflows": 10}', 3),
('pro_plus', 'Pro Plus', 79.00, 799.00, 1600, 100, TRUE, 50, 6, 180, 6, '{"model_access": "core_advanced_metered", "advanced_soft_cap": 0.20, "advanced_hard_cap": 0.25, "team_features": "advanced", "workflows": 25}', 4),
('business', 'Business', 159.00, 1619.00, 3500, 200, TRUE, 100, 10, 300, 10, '{"model_access": "core_advanced_metered", "advanced_soft_cap": 0.20, "advanced_hard_cap": 0.25, "team_features": "full", "workflows": "unlimited", "sso": true}', 5),
('enterprise', 'Enterprise', 299.00, NULL, 10000, 500, TRUE, 999, 20, 600, 20, '{"model_access": "custom", "advanced_soft_cap": 0.30, "advanced_hard_cap": 0.35, "team_features": "enterprise", "workflows": "unlimited", "sso": true, "dedicated_support": true}', 6);

-- ============================================================================
-- 2. USERS TABLE (Extended for PT Tracking)
-- ============================================================================

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  subscription_tier VARCHAR(50) DEFAULT 'freemium' REFERENCES subscription_tiers(tier),
  
  -- Core PT tracking
  core_pt_allocated INTEGER DEFAULT 100,
  core_pt_used INTEGER DEFAULT 0,
  core_pt_rollover INTEGER DEFAULT 0,
  
  -- Advanced PT tracking (metered)
  advanced_pt_allocated INTEGER DEFAULT 0,
  advanced_pt_used INTEGER DEFAULT 0,
  advanced_pt_purchased INTEGER DEFAULT 0,
  
  -- Billing cycle
  billing_cycle_start TIMESTAMP DEFAULT NOW(),
  billing_cycle_end TIMESTAMP DEFAULT (NOW() + INTERVAL '1 month'),
  billing_period VARCHAR(20) DEFAULT 'monthly',
  
  -- Founding member
  is_founding_member BOOLEAN DEFAULT FALSE,
  founding_member_discount DECIMAL(5,2) DEFAULT 0.00,
  founding_member_expires_at TIMESTAMP,
  
  -- Throttling state
  throttle_active BOOLEAN DEFAULT FALSE,
  throttle_until TIMESTAMP,
  throttle_reason VARCHAR(255),
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_active_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_users_tier ON users(subscription_tier);
CREATE INDEX idx_users_billing_cycle ON users(billing_cycle_end);
CREATE INDEX idx_users_throttle ON users(throttle_active, throttle_until);

-- ============================================================================
-- 3. PT USAGE TABLE (Detailed Tracking)
-- ============================================================================

CREATE TABLE IF NOT EXISTS pt_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_id VARCHAR(255),
  
  -- Request details
  agent_id VARCHAR(100) NOT NULL,
  model_used VARCHAR(100) NOT NULL,
  model_requested VARCHAR(100),
  model_class VARCHAR(20) NOT NULL, -- 'core' or 'advanced'
  response_length VARCHAR(20) NOT NULL, -- 'short', 'medium', 'long'
  
  -- Token consumption
  input_tokens INTEGER NOT NULL,
  output_tokens INTEGER NOT NULL,
  total_tokens INTEGER NOT NULL,
  
  -- PT consumption
  pt_consumed INTEGER NOT NULL,
  pt_type VARCHAR(20) NOT NULL, -- 'core' or 'advanced'
  
  -- Cost tracking
  cost_usd DECIMAL(10,6) NOT NULL,
  pt_cost_usd DECIMAL(10,6) NOT NULL,
  
  -- Routing decisions
  routing_decision VARCHAR(50), -- 'default', 'downgraded', 'upgraded', 'throttled'
  routing_reason VARCHAR(255),
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_pt_usage_user ON pt_usage(user_id, created_at DESC);
CREATE INDEX idx_pt_usage_model ON pt_usage(model_class, created_at DESC);
CREATE INDEX idx_pt_usage_agent ON pt_usage(agent_id, created_at DESC);

-- ============================================================================
-- 4. ADVANCED PT CAPS TABLE (Two-Layer Enforcement)
-- ============================================================================

CREATE TABLE IF NOT EXISTS advanced_pt_caps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  billing_cycle_start TIMESTAMP NOT NULL,
  
  -- Current usage
  total_pt_consumed INTEGER DEFAULT 0,
  advanced_pt_consumed INTEGER DEFAULT 0,
  advanced_percentage DECIMAL(5,2) DEFAULT 0.00,
  
  -- Cap thresholds (from tier)
  soft_cap_percentage DECIMAL(5,2) NOT NULL,
  hard_cap_percentage DECIMAL(5,2) NOT NULL,
  
  -- Cap status
  soft_cap_breached BOOLEAN DEFAULT FALSE,
  soft_cap_breached_at TIMESTAMP,
  hard_cap_breached BOOLEAN DEFAULT FALSE,
  hard_cap_breached_at TIMESTAMP,
  
  -- Overflow fees
  overflow_pt_used INTEGER DEFAULT 0,
  overflow_fee_usd DECIMAL(10,2) DEFAULT 0.00,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_advanced_caps_user ON advanced_pt_caps(user_id, billing_cycle_start DESC);
CREATE INDEX idx_advanced_caps_breached ON advanced_pt_caps(hard_cap_breached, updated_at DESC);

-- ============================================================================
-- 5. PT BURN RATE TABLE (40%/72h Throttle Tracking)
-- ============================================================================

CREATE TABLE IF NOT EXISTS pt_burn_rate (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Time window
  window_start TIMESTAMP NOT NULL,
  window_end TIMESTAMP NOT NULL,
  window_hours INTEGER NOT NULL DEFAULT 72,
  
  -- Consumption in window
  pt_consumed_in_window INTEGER NOT NULL,
  pt_allocated_monthly INTEGER NOT NULL,
  burn_percentage DECIMAL(5,2) NOT NULL,
  
  -- Throttle decision
  throttle_triggered BOOLEAN DEFAULT FALSE,
  throttle_reason VARCHAR(255),
  
  -- Projection
  projected_monthly_usage INTEGER,
  projected_exhaustion_date TIMESTAMP,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_burn_rate_user ON pt_burn_rate(user_id, window_start DESC);
CREATE INDEX idx_burn_rate_throttle ON pt_burn_rate(throttle_triggered, created_at DESC);

-- ============================================================================
-- 6. MARGIN MONITORING TABLE (Traffic-Light System)
-- ============================================================================

CREATE TABLE IF NOT EXISTS margin_monitoring (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Scope
  scope_type VARCHAR(50) NOT NULL, -- 'platform', 'tier', 'user'
  scope_id VARCHAR(100), -- tier name or user_id
  
  -- Time period
  period_start TIMESTAMP NOT NULL,
  period_end TIMESTAMP NOT NULL,
  
  -- Financial metrics
  total_revenue DECIMAL(10,2) NOT NULL,
  total_cogs DECIMAL(10,2) NOT NULL,
  gross_margin DECIMAL(5,2) NOT NULL,
  
  -- Usage metrics
  total_pt_consumed INTEGER NOT NULL,
  core_pt_consumed INTEGER NOT NULL,
  advanced_pt_consumed INTEGER NOT NULL,
  advanced_percentage DECIMAL(5,2) NOT NULL,
  
  -- Traffic light status
  status VARCHAR(20) NOT NULL, -- 'green', 'yellow', 'red'
  status_reason VARCHAR(255),
  
  -- Alert tracking
  alert_sent BOOLEAN DEFAULT FALSE,
  alert_sent_at TIMESTAMP,
  mitigation_applied BOOLEAN DEFAULT FALSE,
  mitigation_actions JSONB,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_margin_monitoring_scope ON margin_monitoring(scope_type, scope_id, period_start DESC);
CREATE INDEX idx_margin_monitoring_status ON margin_monitoring(status, alert_sent, created_at DESC);

-- ============================================================================
-- 7. MODEL PRICING TABLE (Dynamic Cost Tracking)
-- ============================================================================

CREATE TABLE IF NOT EXISTS model_pricing (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  model_name VARCHAR(100) NOT NULL,
  model_class VARCHAR(20) NOT NULL, -- 'core' or 'advanced'
  provider VARCHAR(50) NOT NULL, -- 'anthropic', 'openai', etc.
  
  -- Pricing per 1M tokens
  input_cost_per_1m DECIMAL(10,4) NOT NULL,
  output_cost_per_1m DECIMAL(10,4) NOT NULL,
  
  -- Effective dates
  effective_from TIMESTAMP NOT NULL DEFAULT NOW(),
  effective_to TIMESTAMP,
  
  -- Change tracking
  previous_input_cost DECIMAL(10,4),
  previous_output_cost DECIMAL(10,4),
  cost_change_percentage DECIMAL(5,2),
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_model_pricing_active ON model_pricing(model_name, effective_from DESC) WHERE effective_to IS NULL;
CREATE INDEX idx_model_pricing_class ON model_pricing(model_class, effective_from DESC);

-- Insert current model pricing
INSERT INTO model_pricing (model_name, model_class, provider, input_cost_per_1m, output_cost_per_1m) VALUES
('claude-3-haiku-20240307', 'core', 'anthropic', 0.25, 1.25),
('gpt-4o-mini', 'core', 'openai', 0.15, 0.60),
('gpt-4o', 'advanced', 'openai', 5.00, 15.00),
('claude-3-5-sonnet-20241022', 'advanced', 'anthropic', 3.00, 15.00);

-- ============================================================================
-- 8. PT TOP-UPS TABLE (Purchase History)
-- ============================================================================

CREATE TABLE IF NOT EXISTS pt_topups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Purchase details
  pt_type VARCHAR(20) NOT NULL, -- 'core' or 'advanced'
  pt_amount INTEGER NOT NULL,
  price_usd DECIMAL(10,2) NOT NULL,
  discount_percentage DECIMAL(5,2) DEFAULT 0.00,
  
  -- Payment
  stripe_payment_intent_id VARCHAR(255),
  payment_status VARCHAR(50) DEFAULT 'pending',
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_pt_topups_user ON pt_topups(user_id, created_at DESC);
CREATE INDEX idx_pt_topups_payment ON pt_topups(stripe_payment_intent_id);

-- ============================================================================
-- 9. ANONYMOUS SESSIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS anonymous_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id VARCHAR(255) UNIQUE NOT NULL,
  ip_address INET,
  user_agent TEXT,
  
  -- Usage tracking
  questions_asked INTEGER DEFAULT 0,
  pt_used INTEGER DEFAULT 0,
  
  -- Limits
  max_questions INTEGER DEFAULT 1,
  blocked BOOLEAN DEFAULT FALSE,
  blocked_reason VARCHAR(255),
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  last_active_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP DEFAULT (NOW() + INTERVAL '24 hours')
);

-- Create indexes
CREATE INDEX idx_anonymous_sessions_id ON anonymous_sessions(session_id);
CREATE INDEX idx_anonymous_sessions_ip ON anonymous_sessions(ip_address, created_at DESC);
CREATE INDEX idx_anonymous_sessions_expires ON anonymous_sessions(expires_at);

-- ============================================================================
-- 10. HELPER FUNCTIONS
-- ============================================================================

-- Function: Reset monthly PT allocations
CREATE OR REPLACE FUNCTION reset_monthly_pt()
RETURNS INTEGER AS $$
DECLARE
  reset_count INTEGER := 0;
BEGIN
  -- Reset users whose billing cycle has ended
  UPDATE users
  SET 
    core_pt_used = 0,
    advanced_pt_used = 0,
    core_pt_rollover = CASE 
      WHEN billing_period = 'annual' AND subscription_tier IN ('business', 'enterprise')
      THEN LEAST(core_pt_allocated * 0.5, core_pt_allocated - core_pt_used)
      ELSE 0
    END,
    billing_cycle_start = billing_cycle_end,
    billing_cycle_end = billing_cycle_end + INTERVAL '1 month',
    throttle_active = FALSE,
    throttle_until = NULL,
    updated_at = NOW()
  WHERE billing_cycle_end <= NOW();
  
  GET DIAGNOSTICS reset_count = ROW_COUNT;
  RETURN reset_count;
END;
$$ LANGUAGE plpgsql;

-- Function: Check PT availability
CREATE OR REPLACE FUNCTION check_pt_availability(
  p_user_id UUID,
  p_pt_required INTEGER,
  p_pt_type VARCHAR(20)
)
RETURNS JSONB AS $$
DECLARE
  v_user RECORD;
  v_available INTEGER;
  v_result JSONB;
BEGIN
  -- Get user PT status
  SELECT * INTO v_user FROM users WHERE id = p_user_id;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'available', FALSE,
      'reason', 'user_not_found'
    );
  END IF;
  
  -- Check if throttled
  IF v_user.throttle_active AND v_user.throttle_until > NOW() THEN
    RETURN jsonb_build_object(
      'available', FALSE,
      'reason', 'throttled',
      'throttle_until', v_user.throttle_until
    );
  END IF;
  
  -- Calculate available PT
  IF p_pt_type = 'core' THEN
    v_available := v_user.core_pt_allocated + v_user.core_pt_rollover - v_user.core_pt_used;
  ELSE
    v_available := v_user.advanced_pt_allocated + v_user.advanced_pt_purchased - v_user.advanced_pt_used;
  END IF;
  
  -- Check availability
  IF v_available >= p_pt_required THEN
    RETURN jsonb_build_object(
      'available', TRUE,
      'pt_available', v_available,
      'pt_required', p_pt_required
    );
  ELSE
    RETURN jsonb_build_object(
      'available', FALSE,
      'reason', 'insufficient_pt',
      'pt_available', v_available,
      'pt_required', p_pt_required,
      'pt_deficit', p_pt_required - v_available
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function: Consume PT
CREATE OR REPLACE FUNCTION consume_pt(
  p_user_id UUID,
  p_pt_amount INTEGER,
  p_pt_type VARCHAR(20),
  p_usage_id UUID
)
RETURNS JSONB AS $$
DECLARE
  v_user RECORD;
  v_new_usage INTEGER;
  v_result JSONB;
BEGIN
  -- Get current user state
  SELECT * INTO v_user FROM users WHERE id = p_user_id FOR UPDATE;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', FALSE, 'reason', 'user_not_found');
  END IF;
  
  -- Update PT usage
  IF p_pt_type = 'core' THEN
    UPDATE users
    SET 
      core_pt_used = core_pt_used + p_pt_amount,
      updated_at = NOW()
    WHERE id = p_user_id
    RETURNING core_pt_used INTO v_new_usage;
  ELSE
    UPDATE users
    SET 
      advanced_pt_used = advanced_pt_used + p_pt_amount,
      updated_at = NOW()
    WHERE id = p_user_id
    RETURNING advanced_pt_used INTO v_new_usage;
  END IF;
  
  RETURN jsonb_build_object(
    'success', TRUE,
    'pt_consumed', p_pt_amount,
    'pt_type', p_pt_type,
    'new_usage', v_new_usage
  );
END;
$$ LANGUAGE plpgsql;

-- Function: Check and update Advanced PT caps
CREATE OR REPLACE FUNCTION check_advanced_cap(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_user RECORD;
  v_tier RECORD;
  v_cap RECORD;
  v_total_pt INTEGER;
  v_advanced_pct DECIMAL(5,2);
  v_result JSONB;
BEGIN
  -- Get user and tier info
  SELECT u.*, t.features->>'advanced_soft_cap' AS soft_cap, t.features->>'advanced_hard_cap' AS hard_cap
  INTO v_user
  FROM users u
  JOIN subscription_tiers t ON u.subscription_tier = t.tier
  WHERE u.id = p_user_id;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', FALSE, 'reason', 'user_not_found');
  END IF;
  
  -- Calculate total PT and Advanced percentage
  v_total_pt := v_user.core_pt_used + v_user.advanced_pt_used;
  
  IF v_total_pt = 0 THEN
    RETURN jsonb_build_object('success', TRUE, 'status', 'ok', 'advanced_percentage', 0);
  END IF;
  
  v_advanced_pct := (v_user.advanced_pt_used::DECIMAL / v_total_pt::DECIMAL) * 100;
  
  -- Get or create cap record
  INSERT INTO advanced_pt_caps (user_id, billing_cycle_start, soft_cap_percentage, hard_cap_percentage, total_pt_consumed, advanced_pt_consumed, advanced_percentage)
  VALUES (p_user_id, v_user.billing_cycle_start, v_user.soft_cap::DECIMAL, v_user.hard_cap::DECIMAL, v_total_pt, v_user.advanced_pt_used, v_advanced_pct)
  ON CONFLICT (user_id, billing_cycle_start) DO UPDATE
  SET 
    total_pt_consumed = v_total_pt,
    advanced_pt_consumed = v_user.advanced_pt_used,
    advanced_percentage = v_advanced_pct,
    updated_at = NOW()
  RETURNING * INTO v_cap;
  
  -- Check soft cap
  IF v_advanced_pct >= v_cap.soft_cap_percentage AND NOT v_cap.soft_cap_breached THEN
    UPDATE advanced_pt_caps
    SET soft_cap_breached = TRUE, soft_cap_breached_at = NOW()
    WHERE id = v_cap.id;
    
    RETURN jsonb_build_object(
      'success', TRUE,
      'status', 'soft_cap_breached',
      'advanced_percentage', v_advanced_pct,
      'soft_cap', v_cap.soft_cap_percentage
    );
  END IF;
  
  -- Check hard cap
  IF v_advanced_pct >= v_cap.hard_cap_percentage AND NOT v_cap.hard_cap_breached THEN
    UPDATE advanced_pt_caps
    SET hard_cap_breached = TRUE, hard_cap_breached_at = NOW()
    WHERE id = v_cap.id;
    
    RETURN jsonb_build_object(
      'success', TRUE,
      'status', 'hard_cap_breached',
      'advanced_percentage', v_advanced_pct,
      'hard_cap', v_cap.hard_cap_percentage,
      'overflow_fee_applies', TRUE
    );
  END IF;
  
  RETURN jsonb_build_object(
    'success', TRUE,
    'status', 'ok',
    'advanced_percentage', v_advanced_pct,
    'soft_cap', v_cap.soft_cap_percentage,
    'hard_cap', v_cap.hard_cap_percentage
  );
END;
$$ LANGUAGE plpgsql;

-- Function: Check 40%/72h burn rate
CREATE OR REPLACE FUNCTION check_burn_rate(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_user RECORD;
  v_window_start TIMESTAMP;
  v_pt_in_window INTEGER;
  v_burn_pct DECIMAL(5,2);
  v_should_throttle BOOLEAN := FALSE;
BEGIN
  -- Get user info
  SELECT * INTO v_user FROM users WHERE id = p_user_id;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', FALSE, 'reason', 'user_not_found');
  END IF;
  
  -- Calculate 72-hour window
  v_window_start := NOW() - INTERVAL '72 hours';
  
  -- Sum PT consumed in window
  SELECT COALESCE(SUM(pt_consumed), 0)
  INTO v_pt_in_window
  FROM pt_usage
  WHERE user_id = p_user_id
    AND created_at >= v_window_start;
  
  -- Calculate burn percentage
  v_burn_pct := (v_pt_in_window::DECIMAL / v_user.core_pt_allocated::DECIMAL) * 100;
  
  -- Check if should throttle (>40% in 72h)
  IF v_burn_pct > 40 THEN
    v_should_throttle := TRUE;
    
    -- Apply throttle
    UPDATE users
    SET 
      throttle_active = TRUE,
      throttle_until = NOW() + INTERVAL '30 minutes',
      throttle_reason = 'burn_rate_exceeded_40pct_in_72h',
      updated_at = NOW()
    WHERE id = p_user_id;
  END IF;
  
  -- Log burn rate
  INSERT INTO pt_burn_rate (user_id, window_start, window_end, pt_consumed_in_window, pt_allocated_monthly, burn_percentage, throttle_triggered, throttle_reason)
  VALUES (p_user_id, v_window_start, NOW(), v_pt_in_window, v_user.core_pt_allocated, v_burn_pct, v_should_throttle, 
    CASE WHEN v_should_throttle THEN 'burn_rate_exceeded_40pct' ELSE NULL END);
  
  RETURN jsonb_build_object(
    'success', TRUE,
    'burn_percentage', v_burn_pct,
    'pt_in_window', v_pt_in_window,
    'throttle_applied', v_should_throttle
  );
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 11. ANALYTICS VIEWS
-- ============================================================================

-- View: User PT status
CREATE OR REPLACE VIEW user_pt_status AS
SELECT 
  u.id,
  u.email,
  u.subscription_tier,
  u.core_pt_allocated,
  u.core_pt_used,
  u.core_pt_rollover,
  u.advanced_pt_allocated,
  u.advanced_pt_used,
  u.advanced_pt_purchased,
  ROUND((u.core_pt_used::DECIMAL / NULLIF(u.core_pt_allocated, 0)::DECIMAL) * 100, 2) AS core_usage_percentage,
  ROUND((u.advanced_pt_used::DECIMAL / NULLIF(u.advanced_pt_allocated + u.advanced_pt_purchased, 0)::DECIMAL) * 100, 2) AS advanced_usage_percentage,
  u.billing_cycle_end,
  u.throttle_active,
  u.is_founding_member
FROM users u;

-- View: Margin monitoring dashboard
CREATE OR REPLACE VIEW margin_dashboard AS
SELECT 
  scope_type,
  scope_id,
  period_start,
  period_end,
  total_revenue,
  total_cogs,
  gross_margin,
  advanced_percentage,
  status,
  alert_sent,
  mitigation_applied,
  created_at
FROM margin_monitoring
WHERE period_end >= NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;

-- View: Daily usage metrics
CREATE OR REPLACE VIEW daily_usage_metrics AS
SELECT 
  DATE(created_at) AS date,
  model_class,
  COUNT(*) AS request_count,
  SUM(pt_consumed) AS total_pt,
  SUM(cost_usd) AS total_cost,
  AVG(cost_usd) AS avg_cost_per_request,
  COUNT(DISTINCT user_id) AS unique_users
FROM pt_usage
GROUP BY DATE(created_at), model_class
ORDER BY date DESC, model_class;

-- ============================================================================
-- 12. ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pt_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE advanced_pt_caps ENABLE ROW LEVEL SECURITY;
ALTER TABLE pt_burn_rate ENABLE ROW LEVEL SECURITY;
ALTER TABLE pt_topups ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY users_select_own ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY pt_usage_select_own ON pt_usage FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY advanced_caps_select_own ON advanced_pt_caps FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY burn_rate_select_own ON pt_burn_rate FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY topups_select_own ON pt_topups FOR SELECT USING (auth.uid() = user_id);

-- Service role can do everything
CREATE POLICY users_service_all ON users FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY pt_usage_service_all ON pt_usage FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY advanced_caps_service_all ON advanced_pt_caps FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY burn_rate_service_all ON pt_burn_rate FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY topups_service_all ON pt_topups FOR ALL USING (auth.role() = 'service_role');

-- ============================================================================
-- 13. SCHEDULED JOBS (using pg_cron if available)
-- ============================================================================

-- Reset monthly PT (runs daily at midnight)
-- SELECT cron.schedule('reset-monthly-pt', '0 0 * * *', 'SELECT reset_monthly_pt()');

-- Cleanup expired anonymous sessions (runs hourly)
-- SELECT cron.schedule('cleanup-anonymous-sessions', '0 * * * *', 
--   'DELETE FROM anonymous_sessions WHERE expires_at < NOW()');

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

-- Grant permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO postgres, service_role, authenticated;

