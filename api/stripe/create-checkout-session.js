/**
 * API Endpoint: Create Stripe Checkout Session
 * POST /api/stripe/create-checkout-session
 */

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Tier to price ID mapping
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

// PT allocations by tier
const TIER_PT_ALLOCATIONS = {
  entry: { core: 300, advanced: 0 },
  pro: { core: 1000, advanced: 50 },
  proplus: { core: 1600, advanced: 100 },
  business: { core: 3500, advanced: 200 },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { tier, billingCycle = 'monthly', userId } = req.body;

    // Validation
    if (!tier || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!['entry', 'pro', 'proplus', 'business'].includes(tier)) {
      return res.status(400).json({ error: 'Invalid tier' });
    }

    if (!['monthly', 'annual'].includes(billingCycle)) {
      return res.status(400).json({ error: 'Invalid billing cycle' });
    }

    // Get price ID
    const priceId = TIER_PRICES[tier][billingCycle];
    if (!priceId) {
      return res.status(500).json({ error: 'Price ID not configured' });
    }

    // Get or create Stripe customer
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('stripe_customer_id, email')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('Error fetching user:', userError);
      return res.status(500).json({ error: 'Failed to fetch user' });
    }

    let customerId = user.stripe_customer_id;

    // Create Stripe customer if doesn't exist
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_user_id: userId,
        },
      });

      customerId = customer.id;

      // Update user with customer ID
      await supabase
        .from('users')
        .update({ stripe_customer_id: customerId })
        .eq('id', userId);
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}&tier=${tier}`,
      cancel_url: `${process.env.FRONTEND_URL}/subscription/cancel`,
      metadata: {
        user_id: userId,
        tier,
        billing_cycle: billingCycle,
        core_pt: TIER_PT_ALLOCATIONS[tier].core,
        advanced_pt: TIER_PT_ALLOCATIONS[tier].advanced,
      },
      subscription_data: {
        metadata: {
          user_id: userId,
          tier,
        },
      },
      allow_promotion_codes: true,
    });

    return res.status(200).json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Checkout session error:', error);
    return res.status(500).json({
      error: 'Failed to create checkout session',
      message: error.message,
    });
  }
}

