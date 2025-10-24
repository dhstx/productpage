/**
 * API Endpoint: Get Checkout Session by query param
 * GET /api/stripe/session?session_id=cs_xxx
 */

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  try {
    const sessionId = req.query.session_id || req.query.id || req.query.sessionId;
    if (!sessionId) {
      return res.status(400).json({ error: 'Missing session_id' });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return res.status(200).json(session);
  } catch (error) {
    console.error('Session fetch error:', error);
    return res.status(500).json({ error: 'Failed to retrieve session' });
  }
}
