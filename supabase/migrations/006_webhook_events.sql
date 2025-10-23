-- Webhook Events and Dead Letter Queue

-- Webhook events log
CREATE TABLE IF NOT EXISTS webhook_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

