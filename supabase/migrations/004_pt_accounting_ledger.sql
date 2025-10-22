-- PT Accounting Ledger System
-- Tracks every PT transaction for reconciliation and dispute resolution

-- PT Ledger: Complete transaction log
CREATE TABLE IF NOT EXISTS pt_ledger (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
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
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

