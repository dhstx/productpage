/**
 * API Endpoint: Create PT Top-Up Checkout Session
 * POST /api/stripe/create-topup-session
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
    const { amount, ptAmount, userId } = req.body;

    // Validation
    if (!amount || !ptAmount || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (amount < 5 || amount > 1000) {
      return res.status(400).json({ error: 'Amount must be between $5 and $1000' });
    }

    if (ptAmount < 100 || ptAmount > 10000) {
      return res.status(400).json({ error: 'PT amount must be between 100 and 10,000' });
    }

    // Get user
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

    // Create checkout session for one-time payment
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${ptAmount} Platform Tokens`,
              description: `One-time purchase of ${ptAmount} PT`,
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}&type=topup`,
      cancel_url: `${process.env.FRONTEND_URL}/subscription/cancel`,
      metadata: {
        user_id: userId,
        type: 'topup',
        pt_amount: ptAmount,
      },
    });

    return res.status(200).json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Top-up session error:', error);
    return res.status(500).json({
      error: 'Failed to create top-up session',
      message: error.message,
    });
  }
}

