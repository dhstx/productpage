/**
 * API Endpoint: Create Stripe Billing Portal Session
 * POST /api/stripe/create-portal-session
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
    const { customerId, userId } = req.body || {};

    let stripeCustomerId = customerId;

    if (!stripeCustomerId && userId) {
      const { data, error } = await supabase
        .from('users')
        .select('stripe_customer_id, email')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user for portal:', error);
        return res.status(500).json({ error: 'Failed to fetch user' });
      }

      stripeCustomerId = data?.stripe_customer_id;
    }

    if (!stripeCustomerId) {
      return res.status(400).json({ error: 'Missing Stripe customer ID' });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/billing`
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Portal session error:', error);
    return res.status(500).json({ error: 'Failed to create portal session', message: error.message });
  }
}
