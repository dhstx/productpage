/**
 * API Endpoint: Admin Margin Monitoring
 * GET /api/admin/margin-monitoring
 * Returns real-time margin health data for admin dashboard
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

    // Check if user is admin (you can implement your own admin check logic)
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (userError || !userData?.is_admin) {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }

    // Fetch margin monitoring data
    const { data: marginData, error: marginError } = await supabase
      .rpc('get_margin_health_data');

    if (marginError) {
      console.error('Error fetching margin data:', marginError);
      return res.status(500).json({ error: 'Failed to fetch margin data' });
    }

    // Calculate platform-wide metrics
    const platformMetrics = {
      status: marginData?.platform_margin >= 65 ? 'green' : 
              marginData?.platform_margin >= 50 ? 'yellow' : 'red',
      margin: marginData?.platform_margin || 0,
      revenue: marginData?.total_revenue || 0,
      costs: marginData?.total_costs || 0,
      profit: marginData?.total_profit || 0,
    };

    // Get tier-level metrics
    const { data: tierMetrics, error: tierError } = await supabase
      .from('tier_margin_view')
      .select('*')
      .order('margin', { ascending: false });

    if (tierError) {
      console.error('Error fetching tier metrics:', tierError);
    }

    // Get recent alerts
    const { data: alerts, error: alertsError } = await supabase
      .from('margin_alerts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (alertsError) {
      console.error('Error fetching alerts:', alertsError);
    }

    // Get power users (high PT consumption)
    const { data: powerUsers, error: powerUsersError } = await supabase
      .from('token_usage')
      .select(`
        user_id,
        core_pt_used,
        advanced_pt_used,
        users (email)
      `)
      .order('advanced_pt_used', { ascending: false })
      .limit(10);

    if (powerUsersError) {
      console.error('Error fetching power users:', powerUsersError);
    }

    // Return comprehensive margin data
    return res.status(200).json({
      platform: platformMetrics,
      tiers: tierMetrics || [],
      alerts: alerts || [],
      powerUsers: powerUsers || [],
      lastUpdated: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Margin monitoring error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
}

