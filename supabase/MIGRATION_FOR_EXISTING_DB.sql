-- ============================================================================
-- MIGRATION FOR EXISTING DATABASE
-- ============================================================================
-- This migration works with your existing tables and adds PT tracking
-- Run this in Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- STEP 1: Create subscription_tiers table (NEW)
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

-- Insert pricing tiers
INSERT INTO subscription_tiers (tier, display_name, price_usd, price_annual_usd, core_pt_allocated, advanced_pt_allocated, advanced_pt_metered, agent_slots, rate_limit_rpm, rate_limit_rph, concurrency_limit, features, display_order) VALUES
('freemium', 'Freemium', 0.00, 0.00, 100, 0, FALSE, 1, 1, 30, 1, '{"model_access": "core_only"}', 1),
('entry', 'Entry', 19.00, 193.00, 300, 0, TRUE, 5, 2, 60, 2, '{"model_access": "core_only"}', 2),
('pro', 'Professional', 49.00, 499.00, 700, 50, TRUE, 25, 4, 120, 4, '{"model_access": "core_advanced_metered"}', 3),
('pro_plus', 'Pro Plus', 79.00, 799.00, 1600, 100, TRUE, 50, 6, 180, 6, '{"model_access": "core_advanced_metered"}', 4),
('business', 'Business', 159.00, 1619.00, 3500, 200, TRUE, 100, 10, 300, 10, '{"model_access": "core_advanced_metered"}', 5),
('enterprise', 'Enterprise', 299.00, NULL, 10000, 500, TRUE, 999, 20, 600, 20, '{"model_access": "custom"}', 6)
ON CONFLICT (tier) DO NOTHING;

-- ============================================================================
-- STEP 2: Add PT tracking columns to existing users table
-- ============================================================================

-- Add subscription tier column
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_tier VARCHAR(50) DEFAULT 'freemium';

-- Add Core PT tracking
ALTER TABLE users ADD COLUMN IF NOT EXISTS core_pt_allocated INTEGER DEFAULT 100;
ALTER TABLE users ADD COLUMN IF NOT EXISTS core_pt_used INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS core_pt_rollover INTEGER DEFAULT 0;

-- Add Advanced PT tracking
ALTER TABLE users ADD COLUMN IF NOT EXISTS advanced_pt_allocated INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS advanced_pt_used INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS advanced_pt_purchased INTEGER DEFAULT 0;

-- Add billing cycle
ALTER TABLE users ADD COLUMN IF NOT EXISTS billing_cycle_start TIMESTAMP DEFAULT NOW();
ALTER TABLE users ADD COLUMN IF NOT EXISTS billing_cycle_end TIMESTAMP DEFAULT (NOW() + INTERVAL '1 month');
ALTER TABLE users ADD COLUMN IF NOT EXISTS billing_period VARCHAR(20) DEFAULT 'monthly';

-- Add founding member fields
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_founding_member BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS founding_member_discount DECIMAL(5,2) DEFAULT 0.00;
ALTER TABLE users ADD COLUMN IF NOT EXISTS founding_member_expires_at TIMESTAMP;

-- Add throttling state
ALTER TABLE users ADD COLUMN IF NOT EXISTS throttle_active BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS throttle_until TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS throttle_reason VARCHAR(255);

-- Add timestamps if they don't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMP DEFAULT NOW();

-- Add foreign key constraint (will fail silently if already exists)
DO $$
BEGIN
  ALTER TABLE users ADD CONSTRAINT users_subscription_tier_fkey 
    FOREIGN KEY (subscription_tier) REFERENCES subscription_tiers(tier);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================================
-- STEP 3: Create token_usage table (NEW)
-- ============================================================================

CREATE TABLE IF NOT EXISTS token_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_id VARCHAR(255),
  
  -- Request details
  agent_name VARCHAR(100),
  model_used VARCHAR(100) NOT NULL,
  model_class VARCHAR(50) NOT NULL,
  
  -- Token consumption
  input_tokens INTEGER NOT NULL,
  output_tokens INTEGER NOT NULL,
  total_tokens INTEGER NOT NULL,
  pt_consumed INTEGER NOT NULL,
  
  -- Cost tracking
  cost_usd DECIMAL(10,6) NOT NULL,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_token_usage_user_id ON token_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_token_usage_created_at ON token_usage(created_at);
CREATE INDEX IF NOT EXISTS idx_token_usage_model_class ON token_usage(model_class);

-- ============================================================================
-- STEP 4: Create user_subscriptions table (NEW)
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  tier VARCHAR(50) REFERENCES subscription_tiers(tier),
  
  -- Stripe integration
  stripe_subscription_id VARCHAR(255) UNIQUE,
  stripe_customer_id VARCHAR(255),
  stripe_price_id VARCHAR(255),
  
  -- Status
  status VARCHAR(50) DEFAULT 'active',
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  
  -- Dates
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  canceled_at TIMESTAMP,
  ended_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_stripe_subscription_id ON user_subscriptions(stripe_subscription_id);

-- ============================================================================
-- STEP 5: Create pt_ledger table (NEW) - Financial audit trail
-- ============================================================================

CREATE TABLE IF NOT EXISTS pt_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Transaction details
  transaction_type VARCHAR(50) NOT NULL, -- 'allocation', 'usage', 'purchase', 'refund', 'adjustment'
  pt_type VARCHAR(20) NOT NULL, -- 'core' or 'advanced'
  amount INTEGER NOT NULL, -- positive for credits, negative for debits
  balance_after INTEGER NOT NULL,
  
  -- Reference
  reference_id UUID, -- links to token_usage, purchase, etc.
  reference_type VARCHAR(50), -- 'usage', 'purchase', 'subscription', 'admin_adjustment'
  
  -- Metadata
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pt_ledger_user_id ON pt_ledger(user_id);
CREATE INDEX IF NOT EXISTS idx_pt_ledger_created_at ON pt_ledger(created_at);
CREATE INDEX IF NOT EXISTS idx_pt_ledger_transaction_type ON pt_ledger(transaction_type);

-- ============================================================================
-- STEP 6: Create helper functions
-- ============================================================================

-- Function: Reset monthly PT for all users
CREATE OR REPLACE FUNCTION reset_monthly_pt()
RETURNS TABLE (users_reset INTEGER) AS $$
DECLARE
  v_users_reset INTEGER := 0;
BEGIN
  -- Reset PT for users whose billing cycle has ended
  UPDATE users u
  SET 
    core_pt_used = 0,
    core_pt_rollover = LEAST(core_pt_allocated - core_pt_used, 100), -- Max 100 PT rollover
    advanced_pt_used = 0,
    billing_cycle_start = billing_cycle_end,
    billing_cycle_end = billing_cycle_end + INTERVAL '1 month',
    updated_at = NOW()
  WHERE billing_cycle_end <= NOW();
  
  GET DIAGNOSTICS v_users_reset = ROW_COUNT;
  
  RETURN QUERY SELECT v_users_reset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Get user PT status
CREATE OR REPLACE FUNCTION get_user_pt_status(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_user RECORD;
  v_result JSONB;
BEGIN
  SELECT * INTO v_user FROM users WHERE id = p_user_id;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'user_not_found');
  END IF;
  
  v_result := jsonb_build_object(
    'user_id', v_user.id,
    'subscription_tier', v_user.subscription_tier,
    'core_pt', jsonb_build_object(
      'allocated', v_user.core_pt_allocated,
      'used', v_user.core_pt_used,
      'remaining', v_user.core_pt_allocated - v_user.core_pt_used,
      'rollover', v_user.core_pt_rollover,
      'usage_percentage', ROUND((v_user.core_pt_used::DECIMAL / NULLIF(v_user.core_pt_allocated, 0)::DECIMAL) * 100, 2)
    ),
    'advanced_pt', jsonb_build_object(
      'allocated', v_user.advanced_pt_allocated,
      'purchased', v_user.advanced_pt_purchased,
      'used', v_user.advanced_pt_used,
      'remaining', (v_user.advanced_pt_allocated + v_user.advanced_pt_purchased) - v_user.advanced_pt_used,
      'usage_percentage', ROUND((v_user.advanced_pt_used::DECIMAL / NULLIF(v_user.advanced_pt_allocated + v_user.advanced_pt_purchased, 0)::DECIMAL) * 100, 2)
    ),
    'billing_cycle', jsonb_build_object(
      'start', v_user.billing_cycle_start,
      'end', v_user.billing_cycle_end,
      'days_remaining', EXTRACT(DAY FROM v_user.billing_cycle_end - NOW())
    ),
    'throttle', jsonb_build_object(
      'active', v_user.throttle_active,
      'until', v_user.throttle_until,
      'reason', v_user.throttle_reason
    )
  );
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- STEP 7: Grant permissions
-- ============================================================================

GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO postgres, service_role, authenticated;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- You can now verify by running:
-- SELECT * FROM subscription_tiers;
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users';
-- ============================================================================

