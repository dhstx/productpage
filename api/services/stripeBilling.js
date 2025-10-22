/**
 * Stripe Metered Billing Service
 * Handles subscription management and metered Advanced PT billing
 */

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Stripe Price IDs (to be created in Stripe Dashboard)
export const STRIPE_PRICES = {
  entry_monthly: process.env.STRIPE_PRICE_ENTRY_MONTHLY || 'price_entry_monthly',
  entry_annual: process.env.STRIPE_PRICE_ENTRY_ANNUAL || 'price_entry_annual',
  pro_monthly: process.env.STRIPE_PRICE_PRO_MONTHLY || 'price_pro_monthly',
  pro_annual: process.env.STRIPE_PRICE_PRO_ANNUAL || 'price_pro_annual',
  pro_plus_monthly: process.env.STRIPE_PRICE_PRO_PLUS_MONTHLY || 'price_pro_plus_monthly',
  pro_plus_annual: process.env.STRIPE_PRICE_PRO_PLUS_ANNUAL || 'price_pro_plus_annual',
  business_monthly: process.env.STRIPE_PRICE_BUSINESS_MONTHLY || 'price_business_monthly',
  business_annual: process.env.STRIPE_PRICE_BUSINESS_ANNUAL || 'price_business_annual',
  
  // Metered pricing for Advanced PT
  advanced_pt_metered: process.env.STRIPE_PRICE_ADVANCED_PT || 'price_advanced_pt_metered'
};

/**
 * Create Stripe customer
 */
export async function createStripeCustomer(userId, email, supabase) {
  try {
    const customer = await stripe.customers.create({
      email,
      metadata: {
        user_id: userId
      }
    });
    
    // Save customer ID to database
    await supabase
      .from('users')
      .update({
        stripe_customer_id: customer.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
    
    return customer;
  } catch (error) {
    console.error('Error creating Stripe customer:', error);
    throw error;
  }
}

/**
 * Create subscription with metered Advanced PT
 */
export async function createSubscription(userId, tier, billingPeriod = 'monthly', supabase) {
  try {
    // Get user and Stripe customer
    const { data: user } = await supabase
      .from('users')
      .select('email, stripe_customer_id')
      .eq('id', userId)
      .single();
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Create customer if doesn't exist
    let customerId = user.stripe_customer_id;
    if (!customerId) {
      const customer = await createStripeCustomer(userId, user.email, supabase);
      customerId = customer.id;
    }
    
    // Get price ID for tier and billing period
    const priceKey = `${tier}_${billingPeriod}`;
    const priceId = STRIPE_PRICES[priceKey];
    
    if (!priceId) {
      throw new Error(`Invalid tier or billing period: ${priceKey}`);
    }
    
    // Create subscription items
    const items = [
      {
        price: priceId // Base subscription
      }
    ];
    
    // Add metered Advanced PT for tiers that support it
    if (['pro', 'pro_plus', 'business', 'enterprise'].includes(tier)) {
      items.push({
        price: STRIPE_PRICES.advanced_pt_metered
      });
    }
    
    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items,
      metadata: {
        user_id: userId,
        tier
      },
      billing_cycle_anchor: 'now',
      proration_behavior: 'none'
    });
    
    // Update user in database
    await supabase
      .from('users')
      .update({
        subscription_tier: tier,
        billing_period: billingPeriod,
        stripe_subscription_id: subscription.id,
        billing_cycle_start: new Date(subscription.current_period_start * 1000).toISOString(),
        billing_cycle_end: new Date(subscription.current_period_end * 1000).toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
    
    return subscription;
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
}

/**
 * Report metered Advanced PT usage to Stripe
 */
export async function reportMeteredUsage(userId, advancedPTUsed, supabase) {
  try {
    // Get user's subscription
    const { data: user } = await supabase
      .from('users')
      .select('stripe_subscription_id, stripe_customer_id')
      .eq('id', userId)
      .single();
    
    if (!user || !user.stripe_subscription_id) {
      console.warn('User has no active subscription');
      return null;
    }
    
    // Get subscription to find metered item
    const subscription = await stripe.subscriptions.retrieve(user.stripe_subscription_id);
    
    // Find metered Advanced PT item
    const meteredItem = subscription.items.data.find(
      item => item.price.id === STRIPE_PRICES.advanced_pt_metered
    );
    
    if (!meteredItem) {
      console.warn('No metered Advanced PT item found in subscription');
      return null;
    }
    
    // Report usage
    const usageRecord = await stripe.subscriptionItems.createUsageRecord(
      meteredItem.id,
      {
        quantity: advancedPTUsed,
        timestamp: Math.floor(Date.now() / 1000),
        action: 'increment' // Increment usage
      }
    );
    
    return usageRecord;
  } catch (error) {
    console.error('Error reporting metered usage:', error);
    throw error;
  }
}

/**
 * Purchase PT top-up (one-time payment)
 */
export async function purchasePTTopUp(userId, ptAmount, ptType = 'core', supabase) {
  try {
    // Calculate price based on PT amount
    const pricePerPT = ptType === 'advanced' ? 0.035 : 0.010;
    const basePrice = ptAmount * pricePerPT;
    
    // Apply volume discounts
    let discount = 0;
    if (basePrice >= 500) {
      discount = 0.20; // 20% off for $500+
    } else if (basePrice >= 200) {
      discount = 0.12; // 12% off for $200+
    } else if (basePrice >= 50) {
      discount = 0.05; // 5% off for $50+
    }
    
    const finalPrice = basePrice * (1 - discount);
    const amountCents = Math.round(finalPrice * 100);
    
    // Get user's Stripe customer
    const { data: user } = await supabase
      .from('users')
      .select('email, stripe_customer_id')
      .eq('id', userId)
      .single();
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Create customer if doesn't exist
    let customerId = user.stripe_customer_id;
    if (!customerId) {
      const customer = await createStripeCustomer(userId, user.email, supabase);
      customerId = customer.id;
    }
    
    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: 'usd',
      customer: customerId,
      metadata: {
        user_id: userId,
        pt_amount: ptAmount,
        pt_type: ptType,
        discount_percentage: discount * 100
      },
      description: `PT Top-up: ${ptAmount} ${ptType.toUpperCase()} PT`
    });
    
    // Log top-up purchase
    await supabase
      .from('pt_topups')
      .insert({
        user_id: userId,
        pt_type: ptType,
        pt_amount: ptAmount,
        price_usd: finalPrice,
        discount_percentage: discount * 100,
        stripe_payment_intent_id: paymentIntent.id,
        payment_status: 'pending'
      });
    
    return {
      paymentIntent,
      clientSecret: paymentIntent.client_secret,
      amount: finalPrice,
      discount,
      ptAmount
    };
  } catch (error) {
    console.error('Error creating PT top-up:', error);
    throw error;
  }
}

/**
 * Handle successful payment (webhook)
 */
export async function handlePaymentSuccess(paymentIntentId, supabase) {
  try {
    // Get payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      return;
    }
    
    const userId = paymentIntent.metadata.user_id;
    const ptAmount = parseInt(paymentIntent.metadata.pt_amount);
    const ptType = paymentIntent.metadata.pt_type;
    
    // Update top-up record
    await supabase
      .from('pt_topups')
      .update({
        payment_status: 'completed'
      })
      .eq('stripe_payment_intent_id', paymentIntentId);
    
    // Add PT to user's account
    if (ptType === 'advanced') {
      await supabase
        .from('users')
        .update({
          advanced_pt_purchased: supabase.raw(`advanced_pt_purchased + ${ptAmount}`),
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
    } else {
      await supabase
        .from('users')
        .update({
          core_pt_allocated: supabase.raw(`core_pt_allocated + ${ptAmount}`),
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
    }
    
    return {
      success: true,
      userId,
      ptAmount,
      ptType
    };
  } catch (error) {
    console.error('Error handling payment success:', error);
    throw error;
  }
}

/**
 * Handle subscription updated (webhook)
 */
export async function handleSubscriptionUpdated(subscriptionId, supabase) {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const userId = subscription.metadata.user_id;
    
    // Update user's billing cycle
    await supabase
      .from('users')
      .update({
        billing_cycle_start: new Date(subscription.current_period_start * 1000).toISOString(),
        billing_cycle_end: new Date(subscription.current_period_end * 1000).toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
    
    // If subscription renewed, reset PT
    if (subscription.status === 'active') {
      await supabase.rpc('reset_monthly_pt');
    }
    
    return {
      success: true,
      userId
    };
  } catch (error) {
    console.error('Error handling subscription update:', error);
    throw error;
  }
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(userId, supabase) {
  try {
    const { data: user } = await supabase
      .from('users')
      .select('stripe_subscription_id')
      .eq('id', userId)
      .single();
    
    if (!user || !user.stripe_subscription_id) {
      throw new Error('No active subscription found');
    }
    
    // Cancel at period end (don't immediately cancel)
    const subscription = await stripe.subscriptions.update(
      user.stripe_subscription_id,
      {
        cancel_at_period_end: true
      }
    );
    
    return subscription;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
}

/**
 * Get subscription details
 */
export async function getSubscriptionDetails(userId, supabase) {
  try {
    const { data: user } = await supabase
      .from('users')
      .select('stripe_subscription_id, stripe_customer_id')
      .eq('id', userId)
      .single();
    
    if (!user || !user.stripe_subscription_id) {
      return null;
    }
    
    const subscription = await stripe.subscriptions.retrieve(user.stripe_subscription_id);
    
    // Get upcoming invoice for metered usage
    const upcomingInvoice = await stripe.invoices.retrieveUpcoming({
      customer: user.stripe_customer_id
    });
    
    // Calculate metered Advanced PT usage
    const meteredItem = subscription.items.data.find(
      item => item.price.id === STRIPE_PRICES.advanced_pt_metered
    );
    
    let meteredUsage = 0;
    if (meteredItem) {
      const usageSummary = await stripe.subscriptionItems.listUsageRecordSummaries(
        meteredItem.id,
        {
          limit: 1
        }
      );
      
      if (usageSummary.data.length > 0) {
        meteredUsage = usageSummary.data[0].total_usage;
      }
    }
    
    return {
      subscription,
      upcomingInvoice,
      meteredUsage,
      status: subscription.status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end
    };
  } catch (error) {
    console.error('Error getting subscription details:', error);
    throw error;
  }
}

/**
 * Create Stripe Checkout Session
 */
export async function createCheckoutSession(userId, tier, billingPeriod, supabase) {
  try {
    const { data: user } = await supabase
      .from('users')
      .select('email, stripe_customer_id')
      .eq('id', userId)
      .single();
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Create customer if doesn't exist
    let customerId = user.stripe_customer_id;
    if (!customerId) {
      const customer = await createStripeCustomer(userId, user.email, supabase);
      customerId = customer.id;
    }
    
    // Get price ID
    const priceKey = `${tier}_${billingPeriod}`;
    const priceId = STRIPE_PRICES[priceKey];
    
    if (!priceId) {
      throw new Error(`Invalid tier or billing period: ${priceKey}`);
    }
    
    // Create line items
    const lineItems = [
      {
        price: priceId,
        quantity: 1
      }
    ];
    
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: lineItems,
      mode: 'subscription',
      success_url: `${process.env.APP_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_URL}/pricing`,
      metadata: {
        user_id: userId,
        tier,
        billing_period: billingPeriod
      }
    });
    
    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

