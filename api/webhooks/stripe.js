/**
 * Stripe Webhook Handler
 * Handles Stripe events for subscriptions and payments
 */

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { handlePaymentSuccess, handleSubscriptionUpdated } from '../services/stripeBilling.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const sig = req.headers['stripe-signature'];
  
  let event;
  
  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      webhookSecret
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }
  
  // Handle the event
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object);
        break;
      
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object);
        break;
      
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object.id, supabase);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object);
        break;
      
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object);
        break;
      
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
}

/**
 * Handle payment intent succeeded
 */
async function handlePaymentIntentSucceeded(paymentIntent) {
  console.log('PaymentIntent succeeded:', paymentIntent.id);
  
  // Check if this is a PT top-up
  if (paymentIntent.metadata.pt_amount) {
    await handlePaymentSuccess(paymentIntent.id, supabase);
  }
}

/**
 * Handle payment intent failed
 */
async function handlePaymentIntentFailed(paymentIntent) {
  console.log('PaymentIntent failed:', paymentIntent.id);
  
  // Update top-up record if exists
  await supabase
    .from('pt_topups')
    .update({
      payment_status: 'failed'
    })
    .eq('stripe_payment_intent_id', paymentIntent.id);
}

/**
 * Handle subscription created
 */
async function handleSubscriptionCreated(subscription) {
  console.log('Subscription created:', subscription.id);
  
  const userId = subscription.metadata.user_id;
  const tier = subscription.metadata.tier;
  
  if (!userId || !tier) {
    console.warn('Missing user_id or tier in subscription metadata');
    return;
  }
  
  // Get tier configuration
  const { data: tierConfig } = await supabase
    .from('subscription_tiers')
    .select('*')
    .eq('tier', tier)
    .single();
  
  if (!tierConfig) {
    console.error('Tier not found:', tier);
    return;
  }
  
  // Update user
  await supabase
    .from('users')
    .update({
      subscription_tier: tier,
      stripe_subscription_id: subscription.id,
      core_pt_allocated: tierConfig.core_pt_allocated,
      advanced_pt_allocated: tierConfig.advanced_pt_allocated,
      billing_cycle_start: new Date(subscription.current_period_start * 1000).toISOString(),
      billing_cycle_end: new Date(subscription.current_period_end * 1000).toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);
  
  console.log(`User ${userId} subscribed to ${tier}`);
}

/**
 * Handle subscription deleted (canceled)
 */
async function handleSubscriptionDeleted(subscription) {
  console.log('Subscription deleted:', subscription.id);
  
  const userId = subscription.metadata.user_id;
  
  if (!userId) {
    console.warn('Missing user_id in subscription metadata');
    return;
  }
  
  // Downgrade to freemium
  const { data: freemiumTier } = await supabase
    .from('subscription_tiers')
    .select('*')
    .eq('tier', 'freemium')
    .single();
  
  if (freemiumTier) {
    await supabase
      .from('users')
      .update({
        subscription_tier: 'freemium',
        stripe_subscription_id: null,
        core_pt_allocated: freemiumTier.core_pt_allocated,
        advanced_pt_allocated: 0,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
  }
  
  console.log(`User ${userId} downgraded to freemium`);
}

/**
 * Handle invoice payment succeeded
 */
async function handleInvoicePaymentSucceeded(invoice) {
  console.log('Invoice payment succeeded:', invoice.id);
  
  // If this is a subscription renewal, reset PT
  if (invoice.subscription) {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
    const userId = subscription.metadata.user_id;
    
    if (userId) {
      // Reset PT for new billing cycle
      await supabase.rpc('reset_monthly_pt');
      console.log(`PT reset for user ${userId}`);
    }
  }
}

/**
 * Handle invoice payment failed
 */
async function handleInvoicePaymentFailed(invoice) {
  console.log('Invoice payment failed:', invoice.id);
  
  // Notify user of payment failure
  if (invoice.subscription) {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
    const userId = subscription.metadata.user_id;
    
    if (userId) {
      // TODO: Send email notification
      console.log(`Payment failed for user ${userId}`);
    }
  }
}

/**
 * Handle checkout session completed
 */
async function handleCheckoutSessionCompleted(session) {
  console.log('Checkout session completed:', session.id);
  
  const userId = session.metadata.user_id;
  const tier = session.metadata.tier;
  
  if (!userId || !tier) {
    console.warn('Missing user_id or tier in session metadata');
    return;
  }
  
  // Subscription will be created automatically, just log
  console.log(`Checkout completed for user ${userId}, tier ${tier}`);
}

// Export for Vercel serverless
export const config = {
  api: {
    bodyParser: false // Stripe requires raw body
  }
};

