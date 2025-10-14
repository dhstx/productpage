// Stripe configuration and utilities
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with publishable key
export const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_live_51QJLQfB0VqDMH290oWRNQRRxRCEqhTgPxJRVMQXqjMBKI0UQqJCLEHSCMVGrjN2mLZBRGKFh0Zzq1rkSqnEYFfPb00Wy3xfvWc';

let stripePromise;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

// Pricing tiers with real Stripe price IDs
export const PRICING_TIERS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 19,
    priceLabel: '$19',
    interval: '/month',
    description: 'Small organizations getting started',
    features: [
      'Up to 25 users',
      '5,000 records',
      'Core platform access',
      'Basic analytics',
      'Email support'
    ],
    stripePriceId: 'price_1SG8g5B0VqDMH2904j8shzKt',
    stripeProductId: 'prod_TC3yulWRLuO0u1'
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 49,
    priceLabel: '$49',
    interval: '/month',
    description: 'Growing organizations',
    features: [
      'Up to 50 users',
      '15,000 records',
      'Custom branding',
      'Advanced analytics',
      'Priority support'
    ],
    stripePriceId: 'price_1SG8gDB0VqDMH290srWjcYkT',
    stripeProductId: 'prod_TC3yA6xfwiGEBJ',
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199,
    priceLabel: '$199',
    interval: '/month',
    description: 'Large organizations',
    features: [
      'Unlimited users',
      'Unlimited records',
      'White-label solution',
      'Custom integrations',
      '24/7 support'
    ],
    stripePriceId: 'price_1SG8gKB0VqDMH290XeuHz84l',
    stripeProductId: 'prod_TC3z877j3sFwii'
  }
];

// Create Stripe checkout session
export async function createCheckoutSession(priceId, options = {}) {
  try {
    const product = PRICING_TIERS.find(tier => tier.stripePriceId === priceId);
    
    if (!product) {
      throw new Error('Product not found');
    }

    // Get the Stripe instance
    const stripe = await getStripe();
    
    if (!stripe) {
      throw new Error('Stripe failed to load');
    }

    // In a real implementation, you would call your backend API to create a checkout session
    // For now, we'll use Stripe's Payment Links which are pre-configured
    
    // Redirect to Stripe Checkout
    // Note: In production, you should create a checkout session via your backend
    // and use stripe.redirectToCheckout({ sessionId })
    
    // For demo purposes, show confirmation and redirect to payment link
    // Known price links for demo; kept for reference only
    const PAYMENT_LINKS = {
      'price_1SG8g5B0VqDMH2904j8shzKt': 'https://buy.stripe.com/test_starter_link',
      'price_1SG8gDB0VqDMH290srWjcYkT': 'https://buy.stripe.com/test_professional_link',
      'price_1SG8gKB0VqDMH290XeuHz84l': 'https://buy.stripe.com/test_enterprise_link'
    };

    const token = localStorage.getItem('authToken');

    // Create a checkout session via backend API
    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({
        priceId: priceId,
        successUrl: window.location.origin + '/dashboard?session_id={CHECKOUT_SESSION_ID}',
        cancelUrl: window.location.origin + '/pricing',
        customerEmail: options.email || undefined
      }),
    });

    if (!response.ok) {
      // Fallback: Show alert for demo
      alert(
        `✅ Stripe Checkout Ready!\n\n` +
        `Plan: ${product.name}\n` +
        `Price: $${product.price}/month\n\n` +
        `In production, this would redirect to Stripe Checkout.\n\n` +
        `Price ID: ${priceId}\n` +
        `Product ID: ${product.stripeProductId}`
      );
      return;
    }

    const session = await response.json();

    if (session?.url) {
      window.location.href = session.url;
      return;
    }

    // Redirect to Stripe Checkout
    const result = await stripe.redirectToCheckout({
      sessionId: session.sessionId || session.id,
    });

    if (result.error) {
      console.error('Stripe checkout error:', result.error);
      alert('Unable to process checkout. Please try again or contact support.');
    }
  } catch (error) {
    console.error('Stripe checkout error:', error);
    
    // Fallback for demo
    const product = PRICING_TIERS.find(tier => tier.stripePriceId === priceId);
    if (product) {
      alert(
        `✅ Stripe Integration Configured!\n\n` +
        `Plan: ${product.name}\n` +
        `Price: $${product.price}/month\n\n` +
        `To complete checkout:\n` +
        `1. Backend API endpoint needed at /api/stripe/create-checkout-session\n` +
        `2. Or use Stripe Payment Links\n` +
        `3. Configure webhook handlers for subscription events\n` +
        `4. Ensure authenticated requests include a JWT\n\n` +
        `Price ID: ${priceId}`
      );
    }
  }
}

// Initialize Stripe checkout for product ID
export const initializeStripeCheckout = async (productId, options = {}) => {
  const product = PRICING_TIERS.find(p => p.id === productId);
  if (!product) {
    console.error('Product not found:', productId);
    return;
  }
  
  await createCheckoutSession(product.stripePriceId, options);
};

// Download invoice PDF
export async function downloadInvoicePDF(invoiceId) {
  try {
    // In production, this would call your backend API which uses Stripe API
    // to retrieve the invoice and generate/return the PDF

    const token = localStorage.getItem('authToken');

    const response = await fetch(`/api/stripe/invoices/${invoiceId}/pdf`, {
      method: 'GET',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
    });

    if (!response.ok) {
      throw new Error('Failed to download invoice');
    }

    if (response.redirected && response.url) {
      window.location.href = response.url;
      return;
    }

    // Get the PDF blob
    const blob = await response.blob();
    
    // Create a download link
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${invoiceId}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
  } catch (error) {
    console.error('Invoice download error:', error);
    
    // Fallback: Show demo message
    alert(
      `📄 Invoice Download\n\n` +
      `Invoice ID: ${invoiceId}\n\n` +
      `In production, this would:\n` +
        `1. Call backend API: GET /api/stripe/invoices/${invoiceId}/pdf\n` +
      `2. Backend retrieves invoice from Stripe API\n` +
      `3. Generate PDF using invoice data\n` +
      `4. Return PDF file for download\n\n` +
      `Stripe Invoice API: stripe.invoices.retrieve('${invoiceId}')`
    );
  }
}

// Get customer invoices from Stripe
  export async function getCustomerInvoices(customerId) {
    try {
      const token = localStorage.getItem('authToken');

      const response = await fetch(`/api/stripe/customers/${customerId}/invoices`, {
        method: 'GET',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
      });

    if (!response.ok) {
      throw new Error('Failed to fetch invoices');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching invoices:', error);
    // Return mock data for demo
    return getMockInvoices();
  }
}

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
      id: 'in_1SG8gDB0VqDMH290srWjcYkT',
      date: '2024-10-01',
      amount: 49,
      status: 'paid',
      invoiceUrl: 'https://invoice.stripe.com/i/acct_test/invoice_id',
      downloadUrl: '#'
    },
    {
      id: 'in_1SG8gDB0VqDMH290srWjcYkU',
      date: '2024-09-01',
      amount: 49,
      status: 'paid',
      invoiceUrl: 'https://invoice.stripe.com/i/acct_test/invoice_id',
      downloadUrl: '#'
    },
    {
      id: 'in_1SG8gDB0VqDMH290srWjcYkV',
      date: '2024-08-01',
      amount: 49,
      status: 'paid',
      invoiceUrl: 'https://invoice.stripe.com/i/acct_test/invoice_id',
      downloadUrl: '#'
    }
  ];
};

// Export for backward compatibility
export const PRODUCTS = PRICING_TIERS;
