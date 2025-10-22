/**
 * API Endpoint: Get PT Usage
 * GET /api/pt/usage
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get user ID from auth header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Get PT usage from database
    const { data: usage, error: usageError } = await supabase
      .rpc('get_user_pt_usage', { p_user_id: user.id });

    if (usageError) {
      console.error('Error fetching PT usage:', usageError);
      return res.status(500).json({ error: 'Failed to fetch PT usage' });
    }

    // If no usage data, return default freemium
    if (!usage || usage.length === 0) {
      return res.status(200).json({
        tier: 'freemium',
        core: {
          used: 0,
          total: 100,
          percentage: 0,
        },
        advanced: {
          used: 0,
          total: 0,
          percentage: 0,
        },
        reset_date: null,
        days_until_reset: 0,
      });
    }

    const usageData = usage[0];

    // Calculate days until reset
    const resetDate = new Date(usageData.billing_cycle_end);
    const today = new Date();
    const daysUntilReset = Math.ceil((resetDate - today) / (1000 * 60 * 60 * 24));

    return res.status(200).json({
      tier: usageData.tier,
      core: {
        used: usageData.core_pt_used,
        total: usageData.core_pt_total,
        percentage: (usageData.core_pt_used / usageData.core_pt_total) * 100,
      },
      advanced: {
        used: usageData.advanced_pt_used,
        total: usageData.advanced_pt_total,
        percentage: usageData.advanced_pt_total > 0 
          ? (usageData.advanced_pt_used / usageData.advanced_pt_total) * 100 
          : 0,
      },
      reset_date: usageData.billing_cycle_end,
      days_until_reset: Math.max(0, daysUntilReset),
    });
  } catch (error) {
    console.error('PT usage fetch error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
}

