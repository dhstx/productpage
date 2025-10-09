// Subscription Management Controller
import Stripe from 'stripe';
import { asyncHandler } from '../middleware/errorHandler.js';
import db from '../utils/database.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Get subscription status
 */
export const getSubscriptionStatus = asyncHandler(async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const subscription = await db.subscriptions.findByUserId(userId);
  
  if (!subscription) {
    return res.status(404).json({ error: 'No subscription found' });
  }

  // Get usage stats
  const usage = await db.agent_usage.getMonthlyUsage(userId);

  res.json({
    subscription: {
      plan_id: subscription.plan_id,
      status: subscription.status,
      current_period_start: subscription.current_period_start,
      current_period_end: subscription.current_period_end,
      cancel_at_period_end: subscription.cancel_at_period_end
    },
    usage
  });
});

/**
 * Cancel subscription
 */
export const cancelSubscription = asyncHandler(async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const subscription = await db.subscriptions.findByUserId(userId);

  if (!subscription || !subscription.stripe_subscription_id) {
    return res.status(404).json({ error: 'No active subscription to cancel' });
  }

  try {
    // Cancel at period end (don't immediately cancel)
    const stripeSubscription = await stripe.subscriptions.update(
      subscription.stripe_subscription_id,
      {
        cancel_at_period_end: true
      }
    );

    // Update database
    await db.subscriptions.updateByStripeId(subscription.stripe_subscription_id, {
      cancel_at_period_end: true
    });

    res.json({
      message: 'Subscription will be canceled at the end of the billing period',
      subscription: {
        cancel_at_period_end: true,
        current_period_end: new Date(stripeSubscription.current_period_end * 1000)
      }
    });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

/**
 * Reactivate subscription
 */
export const reactivateSubscription = asyncHandler(async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const subscription = await db.subscriptions.findByUserId(userId);

  if (!subscription || !subscription.stripe_subscription_id) {
    return res.status(404).json({ error: 'No subscription found' });
  }

  try {
    // Remove cancel_at_period_end
    await stripe.subscriptions.update(
      subscription.stripe_subscription_id,
      {
        cancel_at_period_end: false
      }
    );

    // Update database
    await db.subscriptions.updateByStripeId(subscription.stripe_subscription_id, {
      cancel_at_period_end: false
    });

    res.json({
      message: 'Subscription reactivated successfully',
      subscription: {
        cancel_at_period_end: false
      }
    });
  } catch (error) {
    console.error('Error reactivating subscription:', error);
    res.status(500).json({ error: 'Failed to reactivate subscription' });
  }
});

/**
 * Update subscription (change plan)
 */
export const updateSubscription = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { priceId, planId } = req.body;

  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (!priceId || !planId) {
    return res.status(400).json({ error: 'Missing priceId or planId' });
  }

  const subscription = await db.subscriptions.findByUserId(userId);

  if (!subscription || !subscription.stripe_subscription_id) {
    return res.status(404).json({ error: 'No active subscription' });
  }

  try {
    // Get current subscription from Stripe
    const stripeSubscription = await stripe.subscriptions.retrieve(
      subscription.stripe_subscription_id
    );

    // Update subscription
    const updated = await stripe.subscriptions.update(
      subscription.stripe_subscription_id,
      {
        items: [{
          id: stripeSubscription.items.data[0].id,
          price: priceId
        }],
        proration_behavior: 'create_prorations',
        metadata: {
          plan_id: planId
        }
      }
    );

    // Update database
    await db.subscriptions.updateByStripeId(subscription.stripe_subscription_id, {
      plan_id: planId
    });

    res.json({
      message: 'Subscription updated successfully',
      subscription: {
        plan_id: planId,
        status: updated.status,
        current_period_end: new Date(updated.current_period_end * 1000)
      }
    });
  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(500).json({ error: 'Failed to update subscription' });
  }
});

