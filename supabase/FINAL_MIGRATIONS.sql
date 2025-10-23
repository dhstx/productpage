-- ============================================================================
-- CONSOLIDATED MIGRATIONS FOR DHSTX.CO (NO EXTENSIONS REQUIRED)
-- ============================================================================
-- Run this entire file in Supabase SQL Editor
-- Project: zhxkbnmtwqipgavmjymi
-- Uses gen_random_uuid() which is built-in to Postgres 13+
-- ============================================================================

-- ============================================================================
-- CONSOLIDATED MIGRATIONS FOR DHSTX.CO
-- ============================================================================
-- Run this entire file in Supabase SQL Editor
-- Project: zhxkbnmtwqipgavmjymi
-- Date: December 2024
-- ============================================================================


-- ============================================================================
-- 001_complete_pricing_system.sql
-- ============================================================================

-- Complete Pricing System Database Schema
-- Version: 3.0 - Metered Advanced PT with Traffic-Light Monitoring
-- Date: 2025-10-22

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. SUBSCRIPTION TIERS TABLE (Updated with V3 Pricing)
-- ============================================================================

CREATE TABLE IF NOT EXISTS subscription_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
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
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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



-- ============================================================================
-- 002_conversation_history.sql
-- ============================================================================

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



-- ============================================================================
-- 003_referral_program.sql
-- ============================================================================

-- Referral Program System
-- Tracks referrals, rewards, and commissions

-- Referral codes table
CREATE TABLE IF NOT EXISTS referral_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  uses_count INTEGER DEFAULT 0,
  max_uses INTEGER DEFAULT NULL, -- NULL = unlimited
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

-- Referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'rewarded', 'cancelled')),
  referrer_reward_type TEXT CHECK (referrer_reward_type IN ('pt', 'discount', 'cash')),
  referrer_reward_amount INTEGER,
  referred_reward_type TEXT CHECK (referred_reward_type IN ('pt', 'discount', 'free_month')),
  referred_reward_amount INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE,
  rewarded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(referred_id)
);

-- Referral rewards table
CREATE TABLE IF NOT EXISTS referral_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_id UUID NOT NULL REFERENCES referrals(id) ON DELETE CASCADE,
  reward_type TEXT NOT NULL CHECK (reward_type IN ('pt', 'discount', 'cash', 'free_month')),
  reward_amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'cancelled')),
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Referral tiers table (for tiered commission rates)
CREATE TABLE IF NOT EXISTS referral_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  min_referrals INTEGER NOT NULL,
  max_referrals INTEGER, -- NULL = no max
  commission_percentage INTEGER NOT NULL, -- e.g., 30 for 30%
  bonus_pt INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default referral tiers
INSERT INTO referral_tiers (name, min_referrals, max_referrals, commission_percentage, bonus_pt)
VALUES 
  ('Bronze', 0, 4, 20, 0),
  ('Silver', 5, 9, 25, 100),
  ('Gold', 10, 24, 30, 250),
  ('Platinum', 25, NULL, 35, 500)
ON CONFLICT (name) DO NOTHING;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_referral_codes_user_id ON referral_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_referral_codes_code ON referral_codes(code);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_id ON referrals(referred_id);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON referrals(status);
CREATE INDEX IF NOT EXISTS idx_referral_rewards_user_id ON referral_rewards(user_id);
CREATE INDEX IF NOT EXISTS idx_referral_rewards_status ON referral_rewards(status);

-- Function to generate unique referral code
CREATE OR REPLACE FUNCTION generate_referral_code(p_user_id UUID)
RETURNS TEXT AS $$
DECLARE
  v_code TEXT;
  v_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate 8-character code
    v_code := upper(substring(md5(random()::text || p_user_id::text) from 1 for 8));
    
    -- Check if code exists
    SELECT EXISTS(SELECT 1 FROM referral_codes WHERE code = v_code) INTO v_exists;
    
    EXIT WHEN NOT v_exists;
  END LOOP;
  
  RETURN v_code;
END;
$$ LANGUAGE plpgsql;

-- Function to create referral code for user
CREATE OR REPLACE FUNCTION create_referral_code_for_user(p_user_id UUID)
RETURNS TEXT AS $$
DECLARE
  v_code TEXT;
BEGIN
  -- Check if user already has an active code
  SELECT code INTO v_code
  FROM referral_codes
  WHERE user_id = p_user_id AND is_active = TRUE
  LIMIT 1;
  
  IF v_code IS NOT NULL THEN
    RETURN v_code;
  END IF;
  
  -- Generate new code
  v_code := generate_referral_code(p_user_id);
  
  -- Insert code
  INSERT INTO referral_codes (user_id, code)
  VALUES (p_user_id, v_code);
  
  RETURN v_code;
END;
$$ LANGUAGE plpgsql;

-- Function to apply referral code
CREATE OR REPLACE FUNCTION apply_referral_code(p_referred_id UUID, p_code TEXT)
RETURNS JSON AS $$
DECLARE
  v_referrer_id UUID;
  v_referral_id UUID;
  v_result JSON;
BEGIN
  -- Check if code exists and is valid
  SELECT user_id INTO v_referrer_id
  FROM referral_codes
  WHERE code = p_code
    AND is_active = TRUE
    AND (expires_at IS NULL OR expires_at > NOW())
    AND (max_uses IS NULL OR uses_count < max_uses);
  
  IF v_referrer_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Invalid or expired referral code');
  END IF;
  
  -- Check if user is trying to refer themselves
  IF v_referrer_id = p_referred_id THEN
    RETURN json_build_object('success', false, 'error', 'Cannot use your own referral code');
  END IF;
  
  -- Check if user already used a referral code
  IF EXISTS(SELECT 1 FROM referrals WHERE referred_id = p_referred_id) THEN
    RETURN json_build_object('success', false, 'error', 'You have already used a referral code');
  END IF;
  
  -- Create referral
  INSERT INTO referrals (
    referrer_id,
    referred_id,
    referral_code,
    status,
    referred_reward_type,
    referred_reward_amount
  ) VALUES (
    v_referrer_id,
    p_referred_id,
    p_code,
    'pending',
    'free_month',
    1
  ) RETURNING id INTO v_referral_id;
  
  -- Increment uses count
  UPDATE referral_codes
  SET uses_count = uses_count + 1
  WHERE code = p_code;
  
  RETURN json_build_object(
    'success', true,
    'referral_id', v_referral_id,
    'reward', 'free_month'
  );
END;
$$ LANGUAGE plpgsql;

-- Function to complete referral (when referred user subscribes)
CREATE OR REPLACE FUNCTION complete_referral(p_referred_id UUID)
RETURNS VOID AS $$
DECLARE
  v_referral_id UUID;
  v_referrer_id UUID;
  v_tier_commission INTEGER;
  v_tier_bonus INTEGER;
  v_referral_count INTEGER;
BEGIN
  -- Get referral
  SELECT id, referrer_id INTO v_referral_id, v_referrer_id
  FROM referrals
  WHERE referred_id = p_referred_id AND status = 'pending';
  
  IF v_referral_id IS NULL THEN
    RETURN;
  END IF;
  
  -- Update referral status
  UPDATE referrals
  SET status = 'completed', completed_at = NOW()
  WHERE id = v_referral_id;
  
  -- Get referrer's tier
  SELECT COUNT(*) INTO v_referral_count
  FROM referrals
  WHERE referrer_id = v_referrer_id AND status IN ('completed', 'rewarded');
  
  SELECT commission_percentage, bonus_pt INTO v_tier_commission, v_tier_bonus
  FROM referral_tiers
  WHERE min_referrals <= v_referral_count
    AND (max_referrals IS NULL OR max_referrals >= v_referral_count)
  ORDER BY min_referrals DESC
  LIMIT 1;
  
  -- Create reward for referrer (1 month free = $49 value, 30% commission = ~$15 in PT)
  INSERT INTO referral_rewards (user_id, referral_id, reward_type, reward_amount, status)
  VALUES (v_referrer_id, v_referral_id, 'pt', 150 + COALESCE(v_tier_bonus, 0), 'approved');
  
  -- Update referral with reward info
  UPDATE referrals
  SET 
    referrer_reward_type = 'pt',
    referrer_reward_amount = 150 + COALESCE(v_tier_bonus, 0),
    status = 'rewarded',
    rewarded_at = NOW()
  WHERE id = v_referral_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get referral stats for user
CREATE OR REPLACE FUNCTION get_referral_stats(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  v_stats JSON;
BEGIN
  SELECT json_build_object(
    'total_referrals', COUNT(*),
    'pending_referrals', COUNT(*) FILTER (WHERE status = 'pending'),
    'completed_referrals', COUNT(*) FILTER (WHERE status IN ('completed', 'rewarded')),
    'total_rewards_pt', COALESCE(SUM(referrer_reward_amount) FILTER (WHERE referrer_reward_type = 'pt'), 0),
    'pending_rewards_pt', (
      SELECT COALESCE(SUM(reward_amount), 0)
      FROM referral_rewards
      WHERE user_id = p_user_id AND status = 'pending'
    ),
    'current_tier', (
      SELECT name
      FROM referral_tiers
      WHERE min_referrals <= (SELECT COUNT(*) FROM referrals WHERE referrer_id = p_user_id AND status IN ('completed', 'rewarded'))
        AND (max_referrals IS NULL OR max_referrals >= (SELECT COUNT(*) FROM referrals WHERE referrer_id = p_user_id AND status IN ('completed', 'rewarded')))
      ORDER BY min_referrals DESC
      LIMIT 1
    ),
    'next_tier', (
      SELECT json_build_object(
        'name', name,
        'min_referrals', min_referrals,
        'referrals_needed', min_referrals - (SELECT COUNT(*) FROM referrals WHERE referrer_id = p_user_id AND status IN ('completed', 'rewarded'))
      )
      FROM referral_tiers
      WHERE min_referrals > (SELECT COUNT(*) FROM referrals WHERE referrer_id = p_user_id AND status IN ('completed', 'rewarded'))
      ORDER BY min_referrals ASC
      LIMIT 1
    )
  ) INTO v_stats
  FROM referrals
  WHERE referrer_id = p_user_id;
  
  RETURN v_stats;
END;
$$ LANGUAGE plpgsql;

-- RLS Policies
ALTER TABLE referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_tiers ENABLE ROW LEVEL SECURITY;

-- Referral codes policies
CREATE POLICY "Users can view their own referral codes"
  ON referral_codes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own referral codes"
  ON referral_codes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own referral codes"
  ON referral_codes FOR UPDATE
  USING (auth.uid() = user_id);

-- Referrals policies
CREATE POLICY "Users can view referrals they're involved in"
  ON referrals FOR SELECT
  USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

-- Rewards policies
CREATE POLICY "Users can view their own rewards"
  ON referral_rewards FOR SELECT
  USING (auth.uid() = user_id);

-- Tiers policies (public read)
CREATE POLICY "Anyone can view referral tiers"
  ON referral_tiers FOR SELECT
  TO authenticated
  USING (true);

-- Grant permissions
GRANT ALL ON referral_codes TO authenticated;
GRANT ALL ON referrals TO authenticated;
GRANT ALL ON referral_rewards TO authenticated;
GRANT SELECT ON referral_tiers TO authenticated;

-- Comments
COMMENT ON TABLE referral_codes IS 'User referral codes for inviting others';
COMMENT ON TABLE referrals IS 'Tracks referrals between users';
COMMENT ON TABLE referral_rewards IS 'Rewards earned from successful referrals';
COMMENT ON TABLE referral_tiers IS 'Tiered commission structure for referrers';
COMMENT ON FUNCTION apply_referral_code IS 'Apply a referral code when signing up';
COMMENT ON FUNCTION complete_referral IS 'Mark referral as complete when referred user subscribes';
COMMENT ON FUNCTION get_referral_stats IS 'Get referral statistics for a user';



-- ============================================================================
-- 004_pt_accounting_ledger.sql
-- ============================================================================

-- PT Accounting Ledger System
-- Tracks every PT transaction for reconciliation and dispute resolution

-- PT Ledger: Complete transaction log
CREATE TABLE IF NOT EXISTS pt_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Transaction details
  transaction_type TEXT NOT NULL CHECK (transaction_type IN (
    'consumption',    -- PT used for chat
    'allocation',     -- PT added (subscription, top-up)
    'refund',         -- PT refunded
    'adjustment',     -- Manual adjustment
    'expiration'      -- PT expired
  )),
  
  -- PT amounts
  core_pt_delta INTEGER NOT NULL DEFAULT 0,
  advanced_pt_delta INTEGER NOT NULL DEFAULT 0,
  
  -- Balances after transaction
  core_pt_balance INTEGER NOT NULL,
  advanced_pt_balance INTEGER NOT NULL,
  
  -- Source information
  source_type TEXT NOT NULL CHECK (source_type IN (
    'chat',
    'subscription',
    'top_up',
    'refund',
    'admin_adjustment',
    'expiration',
    'referral_reward'
  )),
  source_id UUID,  -- Reference to conversation, subscription, etc.
  
  -- Cost tracking (for consumption)
  model_used TEXT,
  input_tokens INTEGER,
  output_tokens INTEGER,
  total_tokens INTEGER,
  provider_cost_usd DECIMAL(10, 6),  -- Actual cost from Anthropic/OpenAI
  
  -- Metadata
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_pt_ledger_user_id (user_id),
  INDEX idx_pt_ledger_created_at (created_at),
  INDEX idx_pt_ledger_transaction_type (transaction_type),
  INDEX idx_pt_ledger_source (source_type, source_id)
);

-- Daily PT reconciliation
CREATE TABLE IF NOT EXISTS pt_reconciliation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Date range
  reconciliation_date DATE NOT NULL UNIQUE,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  
  -- PT totals
  total_core_pt_consumed INTEGER NOT NULL DEFAULT 0,
  total_advanced_pt_consumed INTEGER NOT NULL DEFAULT 0,
  total_pt_allocated INTEGER NOT NULL DEFAULT 0,
  total_pt_refunded INTEGER NOT NULL DEFAULT 0,
  
  -- Cost totals
  total_provider_cost_usd DECIMAL(12, 2) NOT NULL DEFAULT 0,
  total_revenue_usd DECIMAL(12, 2) NOT NULL DEFAULT 0,
  
  -- Stripe reconciliation
  stripe_invoice_total_usd DECIMAL(12, 2),
  stripe_reconciled BOOLEAN DEFAULT FALSE,
  stripe_reconciliation_notes TEXT,
  
  -- Provider reconciliation (Anthropic/OpenAI)
  provider_invoice_total_usd DECIMAL(12, 2),
  provider_reconciled BOOLEAN DEFAULT FALSE,
  provider_reconciliation_notes TEXT,
  
  -- Discrepancies
  discrepancy_amount_usd DECIMAL(12, 2),
  discrepancy_resolved BOOLEAN DEFAULT FALSE,
  discrepancy_resolution TEXT,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending',
    'in_progress',
    'completed',
    'failed',
    'needs_review'
  )),
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  
  INDEX idx_pt_reconciliation_date (reconciliation_date),
  INDEX idx_pt_reconciliation_status (status)
);

-- PT disputes
CREATE TABLE IF NOT EXISTS pt_disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Dispute details
  dispute_type TEXT NOT NULL CHECK (dispute_type IN (
    'incorrect_charge',
    'missing_pt',
    'double_charge',
    'service_issue',
    'other'
  )),
  
  -- Related transaction
  ledger_entry_id UUID REFERENCES pt_ledger(id),
  conversation_id UUID,
  
  -- Amounts
  disputed_pt_amount INTEGER NOT NULL,
  disputed_cost_usd DECIMAL(10, 2),
  
  -- Description
  user_description TEXT NOT NULL,
  user_evidence JSONB DEFAULT '{}'::jsonb,
  
  -- Admin review
  admin_user_id UUID REFERENCES auth.users(id),
  admin_notes TEXT,
  admin_decision TEXT CHECK (admin_decision IN (
    'approved',
    'denied',
    'partial_approval',
    'needs_more_info'
  )),
  
  -- Resolution
  refund_pt_amount INTEGER DEFAULT 0,
  refund_cost_usd DECIMAL(10, 2) DEFAULT 0,
  resolution_notes TEXT,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN (
    'open',
    'under_review',
    'resolved',
    'closed'
  )),
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  
  INDEX idx_pt_disputes_user_id (user_id),
  INDEX idx_pt_disputes_status (status),
  INDEX idx_pt_disputes_created_at (created_at)
);

-- Monthly PT summary per user
CREATE TABLE IF NOT EXISTS pt_monthly_summary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Period
  year INTEGER NOT NULL,
  month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  
  -- PT usage
  core_pt_used INTEGER NOT NULL DEFAULT 0,
  advanced_pt_used INTEGER NOT NULL DEFAULT 0,
  total_pt_used INTEGER NOT NULL DEFAULT 0,
  
  -- Costs
  total_cost_usd DECIMAL(10, 2) NOT NULL DEFAULT 0,
  
  -- Revenue
  subscription_revenue_usd DECIMAL(10, 2) DEFAULT 0,
  topup_revenue_usd DECIMAL(10, 2) DEFAULT 0,
  total_revenue_usd DECIMAL(10, 2) DEFAULT 0,
  
  -- Margin
  gross_margin_usd DECIMAL(10, 2),
  gross_margin_percent DECIMAL(5, 2),
  
  -- Metadata
  conversation_count INTEGER DEFAULT 0,
  message_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(user_id, year, month),
  INDEX idx_pt_monthly_summary_user (user_id),
  INDEX idx_pt_monthly_summary_period (year, month)
);

-- Function: Record PT consumption in ledger
CREATE OR REPLACE FUNCTION record_pt_consumption(
  p_user_id UUID,
  p_core_pt INTEGER,
  p_advanced_pt INTEGER,
  p_source_id UUID,
  p_model TEXT,
  p_input_tokens INTEGER,
  p_output_tokens INTEGER,
  p_provider_cost DECIMAL
) RETURNS UUID AS $$
DECLARE
  v_ledger_id UUID;
  v_current_core_balance INTEGER;
  v_current_advanced_balance INTEGER;
BEGIN
  -- Get current balances
  SELECT core_pt_remaining, advanced_pt_remaining
  INTO v_current_core_balance, v_current_advanced_balance
  FROM user_pt_usage
  WHERE user_id = p_user_id;
  
  -- Insert ledger entry
  INSERT INTO pt_ledger (
    user_id,
    transaction_type,
    core_pt_delta,
    advanced_pt_delta,
    core_pt_balance,
    advanced_pt_balance,
    source_type,
    source_id,
    model_used,
    input_tokens,
    output_tokens,
    total_tokens,
    provider_cost_usd,
    description
  ) VALUES (
    p_user_id,
    'consumption',
    -p_core_pt,
    -p_advanced_pt,
    v_current_core_balance - p_core_pt,
    v_current_advanced_balance - p_advanced_pt,
    'chat',
    p_source_id,
    p_model,
    p_input_tokens,
    p_output_tokens,
    p_input_tokens + p_output_tokens,
    p_provider_cost,
    format('Chat consumption: %s PT (Core: %s, Advanced: %s)', 
           p_core_pt + p_advanced_pt, p_core_pt, p_advanced_pt)
  ) RETURNING id INTO v_ledger_id;
  
  RETURN v_ledger_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Perform daily reconciliation
CREATE OR REPLACE FUNCTION perform_daily_reconciliation(
  p_date DATE DEFAULT CURRENT_DATE - INTERVAL '1 day'
) RETURNS UUID AS $$
DECLARE
  v_reconciliation_id UUID;
  v_start_time TIMESTAMPTZ;
  v_end_time TIMESTAMPTZ;
  v_core_pt_consumed INTEGER;
  v_advanced_pt_consumed INTEGER;
  v_provider_cost DECIMAL;
BEGIN
  -- Define time range
  v_start_time := p_date::TIMESTAMPTZ;
  v_end_time := (p_date + INTERVAL '1 day')::TIMESTAMPTZ;
  
  -- Calculate totals from ledger
  SELECT 
    COALESCE(SUM(ABS(core_pt_delta)), 0),
    COALESCE(SUM(ABS(advanced_pt_delta)), 0),
    COALESCE(SUM(provider_cost_usd), 0)
  INTO v_core_pt_consumed, v_advanced_pt_consumed, v_provider_cost
  FROM pt_ledger
  WHERE transaction_type = 'consumption'
    AND created_at >= v_start_time
    AND created_at < v_end_time;
  
  -- Insert reconciliation record
  INSERT INTO pt_reconciliation (
    reconciliation_date,
    start_time,
    end_time,
    total_core_pt_consumed,
    total_advanced_pt_consumed,
    total_provider_cost_usd,
    status
  ) VALUES (
    p_date,
    v_start_time,
    v_end_time,
    v_core_pt_consumed,
    v_advanced_pt_consumed,
    v_provider_cost,
    'completed'
  ) RETURNING id INTO v_reconciliation_id;
  
  RETURN v_reconciliation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Create PT dispute
CREATE OR REPLACE FUNCTION create_pt_dispute(
  p_user_id UUID,
  p_dispute_type TEXT,
  p_ledger_entry_id UUID,
  p_disputed_pt INTEGER,
  p_description TEXT
) RETURNS UUID AS $$
DECLARE
  v_dispute_id UUID;
BEGIN
  INSERT INTO pt_disputes (
    user_id,
    dispute_type,
    ledger_entry_id,
    disputed_pt_amount,
    user_description,
    status
  ) VALUES (
    p_user_id,
    p_dispute_type,
    p_ledger_entry_id,
    p_disputed_pt,
    p_description,
    'open'
  ) RETURNING id INTO v_dispute_id;
  
  RETURN v_dispute_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies
ALTER TABLE pt_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE pt_reconciliation ENABLE ROW LEVEL SECURITY;
ALTER TABLE pt_disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pt_monthly_summary ENABLE ROW LEVEL SECURITY;

-- Users can view their own ledger
CREATE POLICY "Users can view own ledger"
  ON pt_ledger FOR SELECT
  USING (auth.uid() = user_id);

-- Users can view their own disputes
CREATE POLICY "Users can view own disputes"
  ON pt_disputes FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create disputes
CREATE POLICY "Users can create disputes"
  ON pt_disputes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can view their own monthly summary
CREATE POLICY "Users can view own monthly summary"
  ON pt_monthly_summary FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can view all
CREATE POLICY "Admins can view all ledger"
  ON pt_ledger FOR ALL
  USING (EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admins can view all reconciliations"
  ON pt_reconciliation FOR ALL
  USING (EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admins can manage disputes"
  ON pt_disputes FOR ALL
  USING (EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

COMMENT ON TABLE pt_ledger IS 'Complete audit log of all PT transactions';
COMMENT ON TABLE pt_reconciliation IS 'Daily reconciliation of PT usage vs costs';
COMMENT ON TABLE pt_disputes IS 'User disputes about PT charges';
COMMENT ON TABLE pt_monthly_summary IS 'Monthly PT usage and cost summary per user';



-- ============================================================================
-- 005_security_abuse_log.sql
-- ============================================================================

-- Security and Abuse Detection System

-- Abuse log table
CREATE TABLE IF NOT EXISTS abuse_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  ip_address TEXT NOT NULL,
  request_path TEXT,
  request_method TEXT,
  request_data JSONB,
  abuse_type TEXT NOT NULL CHECK (abuse_type IN (
    'suspicious_pattern',
    'rate_abuse',
    'failed_auth',
    'invalid_token',
    'xss_attempt',
    'sql_injection',
    'path_traversal',
    'command_injection',
    'brute_force',
    'other'
  )),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  blocked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  INDEX idx_abuse_log_ip (ip_address),
  INDEX idx_abuse_log_user (user_id),
  INDEX idx_abuse_log_created (created_at),
  INDEX idx_abuse_log_severity (severity),
  INDEX idx_abuse_log_type (abuse_type)
);

-- IP blocklist
CREATE TABLE IF NOT EXISTS ip_blocklist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address TEXT NOT NULL UNIQUE,
  reason TEXT NOT NULL,
  blocked_by UUID REFERENCES auth.users(id),
  blocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  permanent BOOLEAN DEFAULT FALSE,
  
  INDEX idx_ip_blocklist_ip (ip_address),
  INDEX idx_ip_blocklist_expires (expires_at)
);

-- Security events log
CREATE TABLE IF NOT EXISTS security_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL CHECK (event_type IN (
    'login_success',
    'login_failure',
    'logout',
    'password_reset',
    'email_verification',
    'token_refresh',
    'permission_denied',
    'rate_limit_exceeded',
    'csrf_violation',
    'cors_violation',
    'other'
  )),
  user_id UUID REFERENCES auth.users(id),
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  INDEX idx_security_events_type (event_type),
  INDEX idx_security_events_user (user_id),
  INDEX idx_security_events_created (created_at)
);

-- Failed authentication attempts tracking
CREATE TABLE IF NOT EXISTS failed_auth_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  ip_address TEXT NOT NULL,
  attempt_count INTEGER DEFAULT 1,
  first_attempt_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_attempt_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  locked_until TIMESTAMPTZ,
  
  UNIQUE(email, ip_address),
  INDEX idx_failed_auth_email (email),
  INDEX idx_failed_auth_ip (ip_address),
  INDEX idx_failed_auth_locked (locked_until)
);

-- Function: Check if IP is blocked
CREATE OR REPLACE FUNCTION is_ip_blocked(p_ip_address TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  v_is_blocked BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM ip_blocklist
    WHERE ip_address = p_ip_address
      AND (permanent = TRUE OR expires_at > NOW())
  ) INTO v_is_blocked;
  
  RETURN v_is_blocked;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Record failed auth attempt
CREATE OR REPLACE FUNCTION record_failed_auth(
  p_email TEXT,
  p_ip_address TEXT
) RETURNS VOID AS $$
DECLARE
  v_attempt_count INTEGER;
  v_locked_until TIMESTAMPTZ;
BEGIN
  -- Upsert failed attempt
  INSERT INTO failed_auth_attempts (email, ip_address, attempt_count, last_attempt_at)
  VALUES (p_email, p_ip_address, 1, NOW())
  ON CONFLICT (email, ip_address)
  DO UPDATE SET
    attempt_count = failed_auth_attempts.attempt_count + 1,
    last_attempt_at = NOW()
  RETURNING attempt_count INTO v_attempt_count;
  
  -- Lock account if too many attempts
  IF v_attempt_count >= 5 THEN
    v_locked_until := NOW() + INTERVAL '1 hour';
    
    UPDATE failed_auth_attempts
    SET locked_until = v_locked_until
    WHERE email = p_email AND ip_address = p_ip_address;
    
    -- Log security event
    INSERT INTO security_events (event_type, ip_address, metadata)
    VALUES ('rate_limit_exceeded', p_ip_address, jsonb_build_object(
      'email', p_email,
      'attempt_count', v_attempt_count,
      'locked_until', v_locked_until
    ));
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Reset failed auth attempts
CREATE OR REPLACE FUNCTION reset_failed_auth(p_email TEXT, p_ip_address TEXT)
RETURNS VOID AS $$
BEGIN
  DELETE FROM failed_auth_attempts
  WHERE email = p_email AND ip_address = p_ip_address;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Check if account is locked
CREATE OR REPLACE FUNCTION is_account_locked(p_email TEXT, p_ip_address TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  v_is_locked BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM failed_auth_attempts
    WHERE email = p_email
      AND ip_address = p_ip_address
      AND locked_until > NOW()
  ) INTO v_is_locked;
  
  RETURN v_is_locked;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Block IP address
CREATE OR REPLACE FUNCTION block_ip(
  p_ip_address TEXT,
  p_reason TEXT,
  p_blocked_by UUID,
  p_duration_hours INTEGER DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  v_block_id UUID;
  v_expires_at TIMESTAMPTZ;
  v_permanent BOOLEAN;
BEGIN
  -- Calculate expiration
  IF p_duration_hours IS NULL THEN
    v_expires_at := NULL;
    v_permanent := TRUE;
  ELSE
    v_expires_at := NOW() + (p_duration_hours || ' hours')::INTERVAL;
    v_permanent := FALSE;
  END IF;
  
  -- Insert or update block
  INSERT INTO ip_blocklist (ip_address, reason, blocked_by, expires_at, permanent)
  VALUES (p_ip_address, p_reason, p_blocked_by, v_expires_at, v_permanent)
  ON CONFLICT (ip_address)
  DO UPDATE SET
    reason = EXCLUDED.reason,
    blocked_by = EXCLUDED.blocked_by,
    blocked_at = NOW(),
    expires_at = EXCLUDED.expires_at,
    permanent = EXCLUDED.permanent
  RETURNING id INTO v_block_id;
  
  RETURN v_block_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Unblock IP address
CREATE OR REPLACE FUNCTION unblock_ip(p_ip_address TEXT)
RETURNS VOID AS $$
BEGIN
  DELETE FROM ip_blocklist WHERE ip_address = p_ip_address;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Clean up expired blocks and old logs
CREATE OR REPLACE FUNCTION cleanup_security_data()
RETURNS VOID AS $$
BEGIN
  -- Remove expired IP blocks
  DELETE FROM ip_blocklist
  WHERE permanent = FALSE AND expires_at < NOW();
  
  -- Remove old failed auth attempts (older than 30 days)
  DELETE FROM failed_auth_attempts
  WHERE last_attempt_at < NOW() - INTERVAL '30 days';
  
  -- Remove old abuse logs (older than 90 days)
  DELETE FROM abuse_log
  WHERE created_at < NOW() - INTERVAL '90 days' AND severity IN ('low', 'medium');
  
  -- Remove old security events (older than 90 days, except critical)
  DELETE FROM security_events
  WHERE created_at < NOW() - INTERVAL '90 days'
    AND event_type NOT IN ('permission_denied', 'csrf_violation');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies
ALTER TABLE abuse_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE ip_blocklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE failed_auth_attempts ENABLE ROW LEVEL SECURITY;

-- Only admins can view security tables
CREATE POLICY "Admins can view abuse logs"
  ON abuse_log FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admins can manage IP blocklist"
  ON ip_blocklist FOR ALL
  USING (EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admins can view security events"
  ON security_events FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

-- Users can view their own security events
CREATE POLICY "Users can view own security events"
  ON security_events FOR SELECT
  USING (auth.uid() = user_id);

COMMENT ON TABLE abuse_log IS 'Log of detected abuse and suspicious activity';
COMMENT ON TABLE ip_blocklist IS 'Blocked IP addresses';
COMMENT ON TABLE security_events IS 'Security-related events log';
COMMENT ON TABLE failed_auth_attempts IS 'Failed authentication attempts tracking';



-- ============================================================================
-- 006_webhook_events.sql
-- ============================================================================

-- Webhook Events and Dead Letter Queue

-- Webhook events log
CREATE TABLE IF NOT EXISTS webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_id TEXT NOT NULL UNIQUE,
  source TEXT NOT NULL CHECK (source IN ('stripe', 'other')),
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('received', 'processing', 'processed', 'failed')),
  result JSONB,
  error_message TEXT,
  received_at TIMESTAMPTZ NOT NULL,
  processed_at TIMESTAMPTZ,
  
  INDEX idx_webhook_events_webhook_id (webhook_id),
  INDEX idx_webhook_events_source (source),
  INDEX idx_webhook_events_status (status),
  INDEX idx_webhook_events_received (received_at)
);

-- Webhook dead letter queue (failed webhooks)
CREATE TABLE IF NOT EXISTS webhook_dead_letter_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_id TEXT NOT NULL,
  source TEXT NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  error_message TEXT NOT NULL,
  error_stack TEXT,
  retry_count INTEGER DEFAULT 0,
  failed_at TIMESTAMPTZ NOT NULL,
  last_retry_at TIMESTAMPTZ,
  
  INDEX idx_webhook_dlq_webhook_id (webhook_id),
  INDEX idx_webhook_dlq_source (source),
  INDEX idx_webhook_dlq_retry_count (retry_count),
  INDEX idx_webhook_dlq_failed (failed_at)
);

-- Function: Get webhook statistics
CREATE OR REPLACE FUNCTION get_webhook_stats(
  p_source TEXT DEFAULT NULL,
  p_hours INTEGER DEFAULT 24
) RETURNS TABLE (
  source TEXT,
  event_type TEXT,
  total_count BIGINT,
  processed_count BIGINT,
  failed_count BIGINT,
  avg_processing_time_seconds NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    we.source,
    we.event_type,
    COUNT(*) as total_count,
    COUNT(*) FILTER (WHERE we.status = 'processed') as processed_count,
    COUNT(*) FILTER (WHERE we.status = 'failed') as failed_count,
    AVG(EXTRACT(EPOCH FROM (we.processed_at - we.received_at))) FILTER (WHERE we.processed_at IS NOT NULL) as avg_processing_time_seconds
  FROM webhook_events we
  WHERE we.received_at > NOW() - (p_hours || ' hours')::INTERVAL
    AND (p_source IS NULL OR we.source = p_source)
  GROUP BY we.source, we.event_type
  ORDER BY total_count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Clean up old webhook events
CREATE OR REPLACE FUNCTION cleanup_webhook_events(p_days INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
  v_deleted_count INTEGER;
BEGIN
  -- Delete processed webhooks older than specified days
  DELETE FROM webhook_events
  WHERE status = 'processed'
    AND processed_at < NOW() - (p_days || ' days')::INTERVAL;
  
  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
  
  RETURN v_deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Get dead letter queue summary
CREATE OR REPLACE FUNCTION get_dlq_summary()
RETURNS TABLE (
  source TEXT,
  event_type TEXT,
  count BIGINT,
  oldest_failure TIMESTAMPTZ,
  newest_failure TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    dlq.source,
    dlq.event_type,
    COUNT(*) as count,
    MIN(dlq.failed_at) as oldest_failure,
    MAX(dlq.failed_at) as newest_failure
  FROM webhook_dead_letter_queue dlq
  GROUP BY dlq.source, dlq.event_type
  ORDER BY count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_dead_letter_queue ENABLE ROW LEVEL SECURITY;

-- Only admins can view webhook tables
CREATE POLICY "Admins can view webhook events"
  ON webhook_events FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admins can view DLQ"
  ON webhook_dead_letter_queue FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

COMMENT ON TABLE webhook_events IS 'Log of all webhook events received and processed';
COMMENT ON TABLE webhook_dead_letter_queue IS 'Failed webhooks awaiting retry';



-- ============================================================================
-- 007_logging_monitoring.sql
-- ============================================================================

-- Logging and Monitoring System

-- Application logs
CREATE TABLE IF NOT EXISTS application_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level TEXT NOT NULL CHECK (level IN ('debug', 'info', 'warn', 'error', 'critical')),
  category TEXT NOT NULL CHECK (category IN ('api', 'auth', 'billing', 'pt_tracking', 'security', 'webhook', 'system', 'user')),
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  environment TEXT NOT NULL CHECK (environment IN ('development', 'staging', 'production')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  INDEX idx_logs_level (level),
  INDEX idx_logs_category (category),
  INDEX idx_logs_created (created_at),
  INDEX idx_logs_environment (environment)
);

-- Performance metrics
CREATE TABLE IF NOT EXISTS performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operation TEXT NOT NULL,
  duration_ms INTEGER NOT NULL,
  metrics JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  INDEX idx_perf_operation (operation),
  INDEX idx_perf_recorded (recorded_at)
);

-- Alerts
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level TEXT NOT NULL CHECK (level IN ('warn', 'error', 'critical')),
  category TEXT NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  status TEXT NOT NULL CHECK (status IN ('open', 'acknowledged', 'resolved')) DEFAULT 'open',
  resolution TEXT,
  triggered_at TIMESTAMPTZ NOT NULL,
  acknowledged_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  
  INDEX idx_alerts_status (status),
  INDEX idx_alerts_level (level),
  INDEX idx_alerts_triggered (triggered_at)
);

-- Uptime monitoring
CREATE TABLE IF NOT EXISTS uptime_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint TEXT NOT NULL,
  status_code INTEGER,
  response_time_ms INTEGER,
  is_up BOOLEAN NOT NULL,
  error_message TEXT,
  checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  INDEX idx_uptime_endpoint (endpoint),
  INDEX idx_uptime_checked (checked_at),
  INDEX idx_uptime_is_up (is_up)
);

-- Function: Get log statistics
CREATE OR REPLACE FUNCTION get_log_statistics(p_hours INTEGER DEFAULT 24)
RETURNS TABLE (
  level TEXT,
  category TEXT,
  count BIGINT,
  latest_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    l.level,
    l.category,
    COUNT(*) as count,
    MAX(l.created_at) as latest_at
  FROM application_logs l
  WHERE l.created_at > NOW() - (p_hours || ' hours')::INTERVAL
  GROUP BY l.level, l.category
  ORDER BY count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Get error rate
CREATE OR REPLACE FUNCTION get_error_rate(p_hours INTEGER DEFAULT 1)
RETURNS NUMERIC AS $$
DECLARE
  v_total_count BIGINT;
  v_error_count BIGINT;
  v_error_rate NUMERIC;
BEGIN
  -- Get total log count
  SELECT COUNT(*) INTO v_total_count
  FROM application_logs
  WHERE created_at > NOW() - (p_hours || ' hours')::INTERVAL;
  
  -- Get error count
  SELECT COUNT(*) INTO v_error_count
  FROM application_logs
  WHERE created_at > NOW() - (p_hours || ' hours')::INTERVAL
    AND level IN ('error', 'critical');
  
  -- Calculate error rate
  IF v_total_count > 0 THEN
    v_error_rate := (v_error_count::NUMERIC / v_total_count::NUMERIC) * 100;
  ELSE
    v_error_rate := 0;
  END IF;
  
  RETURN v_error_rate;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Get performance statistics
CREATE OR REPLACE FUNCTION get_performance_statistics(
  p_operation TEXT DEFAULT NULL,
  p_hours INTEGER DEFAULT 24
) RETURNS TABLE (
  operation TEXT,
  count BIGINT,
  avg_duration_ms NUMERIC,
  min_duration_ms INTEGER,
  max_duration_ms INTEGER,
  p50_duration_ms NUMERIC,
  p95_duration_ms NUMERIC,
  p99_duration_ms NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pm.operation,
    COUNT(*) as count,
    AVG(pm.duration_ms)::NUMERIC as avg_duration_ms,
    MIN(pm.duration_ms) as min_duration_ms,
    MAX(pm.duration_ms) as max_duration_ms,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY pm.duration_ms)::NUMERIC as p50_duration_ms,
    PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY pm.duration_ms)::NUMERIC as p95_duration_ms,
    PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY pm.duration_ms)::NUMERIC as p99_duration_ms
  FROM performance_metrics pm
  WHERE pm.recorded_at > NOW() - (p_hours || ' hours')::INTERVAL
    AND (p_operation IS NULL OR pm.operation = p_operation)
  GROUP BY pm.operation
  ORDER BY count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Get uptime percentage
CREATE OR REPLACE FUNCTION get_uptime_percentage(
  p_endpoint TEXT DEFAULT NULL,
  p_hours INTEGER DEFAULT 24
) RETURNS NUMERIC AS $$
DECLARE
  v_total_checks BIGINT;
  v_up_checks BIGINT;
  v_uptime_pct NUMERIC;
BEGIN
  -- Get total checks
  SELECT COUNT(*) INTO v_total_checks
  FROM uptime_checks
  WHERE checked_at > NOW() - (p_hours || ' hours')::INTERVAL
    AND (p_endpoint IS NULL OR endpoint = p_endpoint);
  
  -- Get successful checks
  SELECT COUNT(*) INTO v_up_checks
  FROM uptime_checks
  WHERE checked_at > NOW() - (p_hours || ' hours')::INTERVAL
    AND is_up = TRUE
    AND (p_endpoint IS NULL OR endpoint = p_endpoint);
  
  -- Calculate uptime percentage
  IF v_total_checks > 0 THEN
    v_uptime_pct := (v_up_checks::NUMERIC / v_total_checks::NUMERIC) * 100;
  ELSE
    v_uptime_pct := 100; -- No checks = assume up
  END IF;
  
  RETURN v_uptime_pct;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Clean up old logs
CREATE OR REPLACE FUNCTION cleanup_logs(p_days INTEGER DEFAULT 30)
RETURNS TABLE (
  logs_deleted INTEGER,
  metrics_deleted INTEGER,
  uptime_deleted INTEGER
) AS $$
DECLARE
  v_logs_deleted INTEGER;
  v_metrics_deleted INTEGER;
  v_uptime_deleted INTEGER;
BEGIN
  -- Delete old application logs (except errors)
  DELETE FROM application_logs
  WHERE created_at < NOW() - (p_days || ' days')::INTERVAL
    AND level NOT IN ('error', 'critical');
  GET DIAGNOSTICS v_logs_deleted = ROW_COUNT;
  
  -- Delete old performance metrics
  DELETE FROM performance_metrics
  WHERE recorded_at < NOW() - (p_days || ' days')::INTERVAL;
  GET DIAGNOSTICS v_metrics_deleted = ROW_COUNT;
  
  -- Delete old uptime checks
  DELETE FROM uptime_checks
  WHERE checked_at < NOW() - (p_days || ' days')::INTERVAL;
  GET DIAGNOSTICS v_uptime_deleted = ROW_COUNT;
  
  RETURN QUERY SELECT v_logs_deleted, v_metrics_deleted, v_uptime_deleted;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies
ALTER TABLE application_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE uptime_checks ENABLE ROW LEVEL SECURITY;

-- Only admins can view monitoring tables
CREATE POLICY "Admins can view logs"
  ON application_logs FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admins can view performance metrics"
  ON performance_metrics FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admins can manage alerts"
  ON alerts FOR ALL
  USING (EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admins can view uptime checks"
  ON uptime_checks FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

COMMENT ON TABLE application_logs IS 'Structured application logs';
COMMENT ON TABLE performance_metrics IS 'Performance monitoring data';
COMMENT ON TABLE alerts IS 'System alerts and notifications';
COMMENT ON TABLE uptime_checks IS 'Uptime monitoring checks';


