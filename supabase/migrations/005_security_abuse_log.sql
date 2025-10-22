-- Security and Abuse Detection System

-- Abuse log table
CREATE TABLE IF NOT EXISTS abuse_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

