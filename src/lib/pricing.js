// Pricing configuration with market-rate tiers
export const PRICING_TIERS = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    priceAnnual: 0,
    billingPeriod: 'forever',
    description: 'Perfect for individuals getting started',
    features: {
      agents: 1,
      workflows: 1,
      connections: 5,
      storage: '1 GB',
      analytics: false,
      portal: false,
      prioritySupport: false,
      teamLicenses: 1,
      apiCalls: '1,000/month',
      additionalCredits: false
    },
    featureList: [
      '1 AI agent',
      '1 simultaneous workflow',
      '5 integrations',
      '1 GB storage',
      'Basic analytics',
      'Email support',
      '1 user license',
      '1,000 API calls/month'
    ],
    cta: 'Get Started',
    highlighted: false
  },
  STARTER: {
    id: 'starter',
    name: 'Starter',
    price: 49,
    priceAnnual: 490, // 2 months free
    billingPeriod: 'month',
    description: 'Small teams getting organized',
    features: {
      agents: 3,
      workflows: 5,
      connections: 25,
      storage: '10 GB',
      analytics: true,
      portal: false,
      prioritySupport: false,
      teamLicenses: 5,
      apiCalls: '10,000/month',
      additionalCredits: true
    },
    featureList: [
      'Up to 3 AI agents',
      '5 simultaneous workflows',
      '25 integrations',
      '10 GB storage',
      'Advanced analytics',
      'Priority email support',
      'Up to 5 team licenses',
      '10,000 API calls/month',
      'Buy additional credits when needed'
    ],
    cta: 'Start Free Trial',
    highlighted: false,
    stripePrice: 'price_starter_monthly',
    stripePriceAnnual: 'price_starter_annual'
  },
  PROFESSIONAL: {
    id: 'professional',
    name: 'Professional',
    price: 149,
    priceAnnual: 1490, // 2 months free
    billingPeriod: 'month',
    description: 'Growing organizations scaling operations',
    features: {
      agents: 10,
      workflows: 20,
      connections: 100,
      storage: '100 GB',
      analytics: true,
      portal: true,
      prioritySupport: true,
      teamLicenses: 25,
      apiCalls: '100,000/month',
      additionalCredits: true
    },
    featureList: [
      'Up to 10 AI agents',
      '20 simultaneous workflows',
      '100 integrations',
      '100 GB storage',
      'Advanced analytics & reporting',
      'Custom portal access',
      'Priority support (24/7)',
      'Up to 25 team licenses',
      '100,000 API calls/month',
      'Buy additional credits when needed',
      'Custom branding',
      'API access'
    ],
    cta: 'Start Free Trial',
    highlighted: true,
    stripePrice: 'price_professional_monthly',
    stripePriceAnnual: 'price_professional_annual'
  },
  ENTERPRISE: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 499,
    priceAnnual: 4990, // 2 months free
    billingPeriod: 'month',
    description: 'Large organizations with advanced needs',
    features: {
      agents: 'unlimited',
      workflows: 'unlimited',
      connections: 'unlimited',
      storage: 'unlimited',
      analytics: true,
      portal: true,
      prioritySupport: true,
      teamLicenses: 'unlimited',
      apiCalls: 'unlimited',
      additionalCredits: true
    },
    featureList: [
      'Unlimited AI agents',
      'Unlimited simultaneous workflows',
      'Unlimited integrations',
      'Unlimited storage',
      'Advanced analytics & custom reports',
      'White-label portal',
      'Dedicated account manager',
      'Unlimited team licenses',
      'Unlimited API calls',
      'Buy additional credits when needed',
      'Custom integrations',
      'SLA guarantees',
      'On-premise deployment option',
      'Advanced security features'
    ],
    cta: 'Get Started',
    highlighted: false,
    stripePrice: 'price_enterprise_monthly',
    stripePriceAnnual: 'price_enterprise_annual'
  }
};

// Get pricing tier by ID
export const getPricingTier = (tierId) => {
  return Object.values(PRICING_TIERS).find(tier => tier.id === tierId) || PRICING_TIERS.FREE;
};

// Get all pricing tiers as array
export const getAllPricingTiers = () => {
  return Object.values(PRICING_TIERS);
};

// Check if user can access feature based on tier
export const canAccessFeature = (userTier, featureName) => {
  const tier = getPricingTier(userTier);
  if (!tier || !tier.features) {
    return false;
  }
  const featureValue = tier.features[featureName];
  return featureValue === true || featureValue === 'unlimited';
};

// Get feature limit for user tier
export const getFeatureLimit = (userTier, featureName) => {
  const tier = getPricingTier(userTier);
  if (!tier || !tier.features) {
    return 0;
  }
  return tier.features[featureName];
};
