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
