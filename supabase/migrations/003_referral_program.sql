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

