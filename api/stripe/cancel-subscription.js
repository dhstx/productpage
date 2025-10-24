/**
 * API Endpoint: Cancel Subscription at period end
 * POST /api/stripe/cancel-subscription
 */

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { subscriptionId, userId } = req.body || {};
    if (!subscriptionId) {
      return res.status(400).json({ error: 'Missing subscriptionId' });
    }

    const updated = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });

    if (userId) {
      await supabase
        .from('subscription_tiers')
        .update({ status: 'canceled', cancel_at_period_end: true })
        .eq('user_id', userId);
    }

    return res.status(200).json({ success: true, subscription: { id: updated.id, status: updated.status } });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    return res.status(500).json({ error: 'Failed to cancel subscription', message: error.message });
  }
}
