/**
 * API Endpoint: Update Subscription (upgrade/downgrade)
 * POST /api/stripe/update-subscription
 */

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Price ID mapping from env
const TIER_PRICES = {
  entry: {
    monthly: process.env.STRIPE_PRICE_ENTRY_MONTHLY,
    annual: process.env.STRIPE_PRICE_ENTRY_ANNUAL,
  },
  pro: {
    monthly: process.env.STRIPE_PRICE_PRO_MONTHLY,
    annual: process.env.STRIPE_PRICE_PRO_ANNUAL,
  },
  proplus: {
    monthly: process.env.STRIPE_PRICE_PROPLUS_MONTHLY,
    annual: process.env.STRIPE_PRICE_PROPLUS_ANNUAL,
  },
  business: {
    monthly: process.env.STRIPE_PRICE_BUSINESS_MONTHLY,
    annual: process.env.STRIPE_PRICE_BUSINESS_ANNUAL,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { subscriptionId, newTier, billingCycle = 'monthly', userId } = req.body;
    if (!subscriptionId || !newTier) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const priceId = TIER_PRICES[newTier?.toLowerCase()]?.[billingCycle];
    if (!priceId) {
      return res.status(400).json({ error: 'Invalid tier or billing cycle' });
    }

    // Retrieve subscription to get current item ID
    const sub = await stripe.subscriptions.retrieve(subscriptionId);
    const itemId = sub.items.data[0].id;

    const updated = await stripe.subscriptions.update(subscriptionId, {
      items: [
        {
          id: itemId,
          price: priceId,
        },
      ],
      proration_behavior: 'create_prorations',
    });

    // Persist to DB if we have a user
    if (userId) {
      await supabase
        .from('subscription_tiers')
        .update({
          tier: newTier.toLowerCase(),
          billing_cycle: billingCycle,
          stripe_subscription_id: updated.id,
        })
        .eq('user_id', userId);
    }

    return res.status(200).json({ success: true, subscription: { id: updated.id, status: updated.status } });
  } catch (error) {
    console.error('Update subscription error:', error);
    return res.status(500).json({ error: 'Failed to update subscription', message: error.message });
  }
}
