// Stripe configuration and utilities

export const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder';

// Pricing tiers with real Stripe price IDs
export const PRICING_TIERS = [
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
    stripePriceId: 'price_1SFfqkB0VqDMH290zt6Xnwp7'
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
    stripePriceId: 'price_1SFfqxB0VqDMH290idcffhQB',
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
    stripePriceId: 'price_1SFfrAB0VqDMH290Ff81gt1z'
  }
];

// Create Stripe checkout session
export async function createCheckoutSession(priceId) {
  try {
    const product = PRICING_TIERS.find(tier => tier.stripePriceId === priceId);
    
    if (!product) {
      throw new Error('Product not found');
    }

    // Show confirmation dialog
    const confirmed = window.confirm(
      `Subscribe to ${product.name} Plan\n\n` +
      `Price: $${product.price}/month\n\n` +
      `Features:\n${product.features.map(f => '• ' + f).join('\n')}\n\n` +
      `Click OK to proceed to checkout.`
    );

    if (confirmed) {
      // Show info about Stripe integration
      alert(
        '✅ Stripe Integration Ready!\n\n' +
        `Product: ${product.name}\n` +
        `Price ID: ${priceId}\n\n` +
        'To complete real payments:\n' +
        '1. Set up Stripe Payment Links in Dashboard\n' +
        '2. Or implement serverless checkout API\n' +
        '3. Configure webhook handlers\n\n' +
        'Redirecting to demo dashboard...'
      );
      
      // Redirect to login/dashboard
      window.location.href = '/login';
    }
  } catch (error) {
    console.error('Stripe checkout error:', error);
    alert('Unable to process checkout. Please contact support.');
  }
}

// Initialize Stripe checkout for product ID
export const initializeStripeCheckout = async (productId) => {
  const product = PRICING_TIERS.find(p => p.id === productId);
  if (!product) {
    console.error('Product not found:', productId);
    return;
  }
  
  await createCheckoutSession(product.stripePriceId);
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

// Export for backward compatibility
export const PRODUCTS = PRICING_TIERS;
