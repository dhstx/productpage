// Stripe Checkout Session Creation
import Stripe from 'stripe';
import { asyncHandler } from '../middleware/errorHandler.js';
import db from '../utils/database.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Product and price mapping (env overrides for security)
const PRICE_IDS = {
  starter: process.env.STRIPE_PRICE_STARTER_MONTHLY || 'price_1SG8g5B0VqDMH2904j8shzKt',
  professional: process.env.STRIPE_PRICE_PROFESSIONAL_MONTHLY || 'price_1SG8gDB0VqDMH290srWjcYkT',
  enterprise: process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY || 'price_1SG8gKB0VqDMH290XeuHz84l',
  starter_annual: process.env.STRIPE_PRICE_STARTER_ANNUAL,
  professional_annual: process.env.STRIPE_PRICE_PROFESSIONAL_ANNUAL,
  enterprise_annual: process.env.STRIPE_PRICE_ENTERPRISE_ANNUAL
};

export const createCheckoutSession = asyncHandler(async (req, res) => {
  const { priceId, planId } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (!priceId || !planId) {
    return res.status(400).json({ error: 'Missing priceId or planId' });
  }

  // Validate price ID (allow direct priceId or mapped by planId)
  const mappedPrice = PRICE_IDS[planId] || PRICE_IDS[planId.replace('_monthly','')] || PRICE_IDS[planId.replace('_annual','_annual')];
  const valid = Object.values(PRICE_IDS).filter(Boolean).includes(priceId) || !!mappedPrice;
  if (!valid) {
    return res.status(400).json({ error: 'Invalid price ID' });
  }

  try {
    // Get user details
    const user = await db.users.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user already has a Stripe customer ID
    let customerId;
    const subscription = await db.subscriptions.findByUserId(userId);
    
    if (subscription?.stripe_customer_id) {
      customerId = subscription.stripe_customer_id;
    } else {
      // Create new Stripe customer
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          user_id: userId
        }
      });
      customerId = customer.id;

      // Update subscription with customer ID
      if (subscription) {
        await db.subscriptions.upsert({
          ...subscription,
          stripe_customer_id: customerId
        });
      }
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      success_url: `${process.env.APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_URL}/settings?canceled=true`,
      metadata: {
        user_id: userId,
        plan_id: planId
      },
      subscription_data: {
        metadata: {
          user_id: userId,
          plan_id: planId
        }
      }
    });

    res.json({
      sessionId: session.id,
      url: session.url
    });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    res.status(500).json({
      error: 'Failed to create checkout session',
      message: error.message
    });
  }
});

export const getCheckoutSession = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    res.json(session);
  } catch (error) {
    console.error('Error retrieving session:', error);
    res.status(500).json({ error: 'Failed to retrieve session' });
  }
});

