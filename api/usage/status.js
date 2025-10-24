/**
 * Usage Status API
 * GET /api/usage/status?userId=...
 * Returns a consolidated snapshot used by the frontend dashboard.
 */

import { createClient } from '@supabase/supabase-js';
import { getThrottleStatusSummary } from '../services/throttleManager.js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function usageStatusHandler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const userId = req.query.userId || req.user?.id || null;

    // For public dashboard, allow missing userId and return sane defaults
    if (!userId) {
      return res.status(200).json(getDefaultUsage());
    }

    // Fetch aggregated PT status (materialized view in schema)
    const { data: statusRows } = await supabase
      .from('user_pt_status')
      .select('*')
      .eq('id', userId)
      .limit(1);

    const status = statusRows?.[0] || null;

    // If user has no status yet, return defaults
    const ptStatus = status ? mapStatus(status) : getDefaultUsage().ptStatus;

    // Recent usage (last 10)
    const { data: recentUsage } = await supabase
      .from('pt_usage')
      .select('agent_id, model_class, pt_consumed, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    // Throttle and caps summary
    const throttleStatus = await getThrottleStatusSummary(userId, supabase);

    // Quick statistics
    const { data: statsAgg } = await supabase.rpc('get_usage_statistics', {
      p_user_id: userId
    });

    const usageStatistics = statsAgg || {
      totalRequests: recentUsage?.length || 0,
      coreRequests: recentUsage?.filter(r => r.model_class === 'core').length || 0,
      advancedRequests: recentUsage?.filter(r => r.model_class === 'advanced').length || 0,
      avgPTPerRequest: recentUsage && recentUsage.length > 0
        ? recentUsage.reduce((s, r) => s + (r.pt_consumed || 0), 0) / recentUsage.length
        : 0,
      corePercentage: 0,
      advancedPercentage: 0
    };

    // Derive model distribution if rpc not present
    if (!('corePercentage' in usageStatistics)) {
      const total = (usageStatistics.coreRequests || 0) + (usageStatistics.advancedRequests || 0) || 1;
      usageStatistics.corePercentage = Math.round((usageStatistics.coreRequests / total) * 100);
      usageStatistics.advancedPercentage = 100 - usageStatistics.corePercentage;
    }

    // Days context
    const cycleEnd = status?.billing_cycle_end ? new Date(status.billing_cycle_end) : null;
    const start = status?.billing_cycle_start ? new Date(status.billing_cycle_start) : null;
    const now = new Date();
    const daysInCycle = start && now ? Math.max(0, Math.ceil((now - start) / (1000 * 60 * 60 * 24))) : 0;
    const daysInMonth = 30;

    return res.status(200).json({
      ptStatus,
      throttleStatus,
      recentUsage: recentUsage || [],
      statistics: usageStatistics,
      warnings: buildWarnings(throttleStatus),
      daysInCycle,
      daysInMonth
    });
  } catch (error) {
    console.error('Usage status error:', error);
    return res.status(500).json({ error: 'Failed to fetch usage status', message: error.message });
  }
}

function mapStatus(s) {
  return {
    corePTAllocated: s.core_pt_allocated || 0,
    corePTUsed: s.core_pt_used || 0,
    advancedPTAllocated: s.advanced_pt_allocated || 0,
    advancedPTUsed: s.advanced_pt_used || 0,
    billingCycleEnd: s.billing_cycle_end || null,
    throttleActive: !!s.throttle_active
  };
}

function getDefaultUsage() {
  return {
    ptStatus: {
      corePTAllocated: 100,
      corePTUsed: 0,
      advancedPTAllocated: 0,
      advancedPTUsed: 0,
      billingCycleEnd: null,
      throttleActive: false
    },
    throttleStatus: {
      currentlyThrottled: false,
      warnings: []
    },
    recentUsage: [],
    statistics: {
      totalRequests: 0,
      coreRequests: 0,
      advancedRequests: 0,
      avgPTPerRequest: 0,
      corePercentage: 100,
      advancedPercentage: 0
    },
    warnings: [],
    daysInCycle: 0,
    daysInMonth: 30
  };
}

function buildWarnings(throttleStatus) {
  const warnings = [];
  if (!throttleStatus) return warnings;
  if (throttleStatus.softCapBreached) {
    warnings.push({ type: 'advanced_soft_cap', message: 'Approaching Advanced usage limit.' });
  }
  if (throttleStatus.hardCapBreached) {
    warnings.push({ type: 'advanced_hard_cap', message: 'Advanced usage hard cap exceeded.' });
  }
  if (typeof throttleStatus.burnRate72h === 'number' && throttleStatus.burnRate72h > 30) {
    warnings.push({ type: 'burn_rate_warning', message: `72h burn rate ${throttleStatus.burnRate72h}%` });
  }
  return warnings;
}
