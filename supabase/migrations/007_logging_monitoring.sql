-- Logging and Monitoring System

-- Application logs
CREATE TABLE IF NOT EXISTS application_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

