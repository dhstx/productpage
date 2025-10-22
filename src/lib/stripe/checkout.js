/**
 * Stripe Checkout Helper
 * Handles subscription and top-up checkout flows
 */

import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

/**
 * Create a subscription checkout session
 * @param {string} tier - Tier name (entry, pro, proplus, business)
 * @param {string} billingCycle - 'monthly' or 'annual'
 * @param {string} userId - User ID from auth
 * @returns {Promise<void>}
 */
export async function createSubscriptionCheckout(tier, billingCycle = 'monthly', userId) {
  try {
    // Call backend to create checkout session
    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tier: tier.toLowerCase(),
        billingCycle,
        userId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create checkout session');
    }

    const { sessionId, url } = await response.json();

    // Redirect to Stripe Checkout
    if (url) {
      // Direct redirect (preferred)
      window.location.href = url;
    } else if (sessionId) {
      // Redirect via Stripe.js
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error('Stripe checkout error:', error);
        throw error;
      }
    } else {
      throw new Error('No checkout URL or session ID returned');
    }
  } catch (error) {
    console.error('Checkout error:', error);
    throw error;
  }
}

/**
 * Create a PT top-up checkout session
 * @param {number} amount - Amount in dollars
 * @param {number} ptAmount - Number of PT to purchase
 * @param {string} userId - User ID from auth
 * @returns {Promise<void>}
 */
export async function createTopUpCheckout(amount, ptAmount, userId) {
  try {
    const response = await fetch('/api/stripe/create-topup-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        ptAmount,
        userId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create top-up session');
    }

    const { sessionId, url } = await response.json();

    // Redirect to Stripe Checkout
    if (url) {
      window.location.href = url;
    } else if (sessionId) {
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error('Stripe checkout error:', error);
        throw error;
      }
    } else {
      throw new Error('No checkout URL or session ID returned');
    }
  } catch (error) {
    console.error('Top-up checkout error:', error);
    throw error;
  }
}

/**
 * Get PT top-up packages with volume discounts
 * @returns {Array} Array of top-up packages
 */
export function getTopUpPackages() {
  return [
    {
      id: 'topup_100',
      ptAmount: 100,
      price: 5,
      pricePerPT: 0.05,
      discount: 0,
      popular: false,
    },
    {
      id: 'topup_500',
      ptAmount: 500,
      price: 20,
      pricePerPT: 0.04,
      discount: 20,
      popular: true,
    },
    {
      id: 'topup_1000',
      ptAmount: 1000,
      price: 35,
      pricePerPT: 0.035,
      discount: 30,
      popular: false,
    },
    {
      id: 'topup_2500',
      ptAmount: 2500,
      price: 75,
      pricePerPT: 0.03,
      discount: 40,
      popular: false,
    },
  ];
}

/**
 * Get tier price IDs from environment variables
 * @returns {Object} Price IDs for each tier and billing cycle
 */
export function getTierPriceIds() {
  return {
    entry: {
      monthly: import.meta.env.VITE_STRIPE_PRICE_ENTRY_MONTHLY,
      annual: import.meta.env.VITE_STRIPE_PRICE_ENTRY_ANNUAL,
    },
    pro: {
      monthly: import.meta.env.VITE_STRIPE_PRICE_PRO_MONTHLY,
      annual: import.meta.env.VITE_STRIPE_PRICE_PRO_ANNUAL,
    },
    proplus: {
      monthly: import.meta.env.VITE_STRIPE_PRICE_PROPLUS_MONTHLY,
      annual: import.meta.env.VITE_STRIPE_PRICE_PROPLUS_ANNUAL,
    },
    business: {
      monthly: import.meta.env.VITE_STRIPE_PRICE_BUSINESS_MONTHLY,
      annual: import.meta.env.VITE_STRIPE_PRICE_BUSINESS_ANNUAL,
    },
  };
}

/**
 * Validate Stripe configuration
 * @returns {Object} Validation result
 */
export function validateStripeConfig() {
  const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  const priceIds = getTierPriceIds();

  const errors = [];

  if (!publishableKey) {
    errors.push('VITE_STRIPE_PUBLISHABLE_KEY is not set');
  }

  // Check if at least one price ID is set
  const hasPriceIds = Object.values(priceIds).some((tier) =>
    Object.values(tier).some((priceId) => priceId)
  );

  if (!hasPriceIds) {
    errors.push('No Stripe price IDs configured');
  }

  return {
    valid: errors.length === 0,
    errors,
    config: {
      publishableKey: publishableKey ? '✓ Set' : '✗ Missing',
      priceIds: hasPriceIds ? '✓ Set' : '✗ Missing',
    },
  };
}

/**
 * Handle successful checkout (called from success page)
 * @param {string} sessionId - Stripe session ID
 * @returns {Promise<Object>} Session details
 */
export async function getCheckoutSession(sessionId) {
  try {
    const response = await fetch(`/api/stripe/session?session_id=${sessionId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch session details');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching session:', error);
    throw error;
  }
}

/**
 * Cancel subscription
 * @param {string} subscriptionId - Stripe subscription ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Cancellation result
 */
export async function cancelSubscription(subscriptionId, userId) {
  try {
    const response = await fetch('/api/stripe/cancel-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscriptionId,
        userId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to cancel subscription');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Cancel subscription error:', error);
    throw error;
  }
}

/**
 * Update subscription (upgrade/downgrade)
 * @param {string} subscriptionId - Current subscription ID
 * @param {string} newTier - New tier name
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Update result
 */
export async function updateSubscription(subscriptionId, newTier, userId) {
  try {
    const response = await fetch('/api/stripe/update-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscriptionId,
        newTier: newTier.toLowerCase(),
        userId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update subscription');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Update subscription error:', error);
    throw error;
  }
}

/**
 * Get customer portal URL for managing subscription
 * @param {string} customerId - Stripe customer ID
 * @returns {Promise<string>} Portal URL
 */
export async function getCustomerPortalUrl(customerId) {
  try {
    const response = await fetch('/api/stripe/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ customerId }),
    });

    if (!response.ok) {
      throw new Error('Failed to create portal session');
    }

    const { url } = await response.json();
    return url;
  } catch (error) {
    console.error('Portal URL error:', error);
    throw error;
  }
}

export default {
  createSubscriptionCheckout,
  createTopUpCheckout,
  getTopUpPackages,
  getTierPriceIds,
  validateStripeConfig,
  getCheckoutSession,
  cancelSubscription,
  updateSubscription,
  getCustomerPortalUrl,
};

