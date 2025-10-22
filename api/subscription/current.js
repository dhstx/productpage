/**
 * API Endpoint: Get Current Subscription
 * GET /api/subscription/current
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

    // Get subscription from database
    const { data: subscription, error: subError } = await supabase
      .from('subscription_tiers')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (subError && subError.code !== 'PGRST116') {
      console.error('Error fetching subscription:', subError);
      return res.status(500).json({ error: 'Failed to fetch subscription' });
    }

    // If no subscription, return freemium tier
    if (!subscription) {
      return res.status(200).json({
        tier: 'freemium',
        tier_name: 'Freemium',
        description: 'Try our platform risk-free',
        price: 0,
        core_pt_monthly: 100,
        advanced_pt_monthly: 0,
        billing_cycle: 'monthly',
        status: 'active',
        next_billing_date: null,
        stripe_subscription_id: null,
        stripe_customer_id: null,
      });
    }

    return res.status(200).json(subscription);
  } catch (error) {
    console.error('Subscription fetch error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
}

