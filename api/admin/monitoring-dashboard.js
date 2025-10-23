/**
 * Monitoring Dashboard API
 * 
 * Provides real-time monitoring data for admin dashboard
 */

import { createLogger, LogCategory, getLogStatistics, getRecentErrors, getOpenAlerts, healthCheck } from '../services/logger.js';
import { createClient } from '@supabase/supabase-js';

const logger = createLogger(LogCategory.API);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify admin
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }

    // Get monitoring data
    const [
      logStats,
      recentErrors,
      openAlerts,
      health,
      errorRate,
      performanceStats,
      uptimePercentage
    ] = await Promise.all([
      getLogStatistics(24),
      getRecentErrors(20),
      getOpenAlerts(),
      healthCheck(),
      getErrorRate(1),
      getPerformanceStatistics(24),
      getUptimePercentage(24)
    ]);

    const dashboardData = {
      health,
      metrics: {
        error_rate_1h: errorRate,
        uptime_24h: uptimePercentage,
        open_alerts: openAlerts.length,
        recent_errors: recentErrors.length
      },
      log_statistics: logStats,
      recent_errors: recentErrors,
      open_alerts: openAlerts,
      performance_statistics: performanceStats,
      timestamp: new Date().toISOString()
    };

    await logger.info('Monitoring dashboard accessed', {
      user_id: user.id,
      endpoint: '/api/admin/monitoring-dashboard'
    });

    return res.status(200).json(dashboardData);

  } catch (error) {
    await logger.error('Failed to fetch monitoring dashboard', error, {
      endpoint: '/api/admin/monitoring-dashboard'
    });

    return res.status(500).json({ 
      error: 'Failed to fetch monitoring data',
      message: error.message 
    });
  }
}

// Helper functions
async function getErrorRate(hours) {
  const { data, error } = await supabase
    .rpc('get_error_rate', { p_hours: hours });

  if (error) throw error;
  return data || 0;
}

async function getPerformanceStatistics(hours) {
  const { data, error } = await supabase
    .rpc('get_performance_statistics', { p_hours: hours });

  if (error) throw error;
  return data || [];
}

async function getUptimePercentage(hours) {
  const { data, error } = await supabase
    .rpc('get_uptime_percentage', { p_hours: hours });

  if (error) throw error;
  return data || 100;
}

