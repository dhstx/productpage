// Stripe configuration and utilities
// Note: In production, use environment variables for the publishable key

export const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder';

// Product catalog
export const PRODUCTS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 999,
    priceLabel: '$999',
    interval: '/month',
    description: 'Small organizations getting started',
    features: [
      'Up to 25 users',
      '5,000 records',
      'Core platform access',
      'Basic analytics',
      'Email support'
    ],
    stripePriceId: 'price_starter_monthly'
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 2499,
    priceLabel: '$2,499',
    interval: '/month',
    description: 'Growing organizations',
    features: [
      'Up to 50 users',
      '15,000 records',
      'Custom branding',
      'Advanced analytics',
      'Priority support'
    ],
    stripePriceId: 'price_professional_monthly',
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 5999,
    priceLabel: '$5,999',
    interval: '/month',
    description: 'Large organizations',
    features: [
      'Unlimited users',
      'Unlimited records',
      'White-label solution',
      'Custom integrations',
      '24/7 support'
    ],
    stripePriceId: 'price_enterprise_monthly'
  }
];

// Initialize Stripe Checkout
export const initializeStripeCheckout = async (productId) => {
  try {
    // Load Stripe.js
    const stripe = window.Stripe ? window.Stripe(STRIPE_PUBLISHABLE_KEY) : null;
    
    if (!stripe) {
      console.error('Stripe.js not loaded');
      alert('Payment system is loading. Please try again in a moment.');
      return;
    }

    // Find the product
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) {
      console.error('Product not found:', productId);
      return;
    }

    // In production, you would call your backend API to create a checkout session
    // For now, we'll redirect to Stripe Checkout with the price ID
    
    // Note: This requires a backend endpoint to create the checkout session
    // Example backend endpoint: POST /api/create-checkout-session
    
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId: product.stripePriceId,
        productName: product.name,
        quantity: 1
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const session = await response.json();

    // Redirect to Stripe Checkout
    const result = await stripe.redirectToCheckout({
      sessionId: session.id
    });

    if (result.error) {
      console.error('Stripe checkout error:', result.error);
      alert(result.error.message);
    }
  } catch (error) {
    console.error('Checkout initialization error:', error);
    
    // For demo purposes, show a modal with product info
    showDemoCheckoutModal(productId);
  }
};

// Demo checkout modal (for when backend is not available)
export const showDemoCheckoutModal = (productId) => {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const message = `
🎉 Stripe Checkout Demo

You selected: ${product.name}
Price: ${product.priceLabel}${product.interval}

In production, this would open Stripe Checkout where you can:
✓ Enter payment details securely
✓ Complete subscription setup
✓ Get instant access to your platform

Note: To enable real payments, you need to:
1. Create products in your Stripe Dashboard
2. Set up a backend API endpoint for checkout sessions
3. Configure webhook handlers for payment events

For now, you can proceed to the demo dashboard to explore the platform.
  `.trim();

  if (confirm(message + '\n\nWould you like to proceed to the demo dashboard?')) {
    window.location.href = '/login';
  }
};

// Mock purchase history for demo
export const getMockPurchases = () => {
  return [
    {
      id: 'purchase_1',
      productId: 'professional',
      productName: 'Professional Plan',
      purchaseDate: '2024-09-15',
      status: 'active',
      platformUrl: 'https://board.yourorganization.com',
      adminUrl: 'https://board.yourorganization.com/admin'
    }
  ];
};

// Mock invoices for demo
export const getMockInvoices = () => {
  return [
    {
      id: 'inv_001',
      date: '2024-10-01',
      amount: 2499,
      status: 'paid',
      downloadUrl: '#'
    },
    {
      id: 'inv_002',
      date: '2024-09-01',
      amount: 2499,
      status: 'paid',
      downloadUrl: '#'
    },
    {
      id: 'inv_003',
      date: '2024-08-01',
      amount: 2499,
      status: 'paid',
      downloadUrl: '#'
    }
  ];
};
