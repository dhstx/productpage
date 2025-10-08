// Authentication utilities
const AUTH_KEY = 'dhstx_auth';

// Subscription tiers
export const SUBSCRIPTION_TIERS = {
  FREE: 'free',
  STARTER: 'starter',
  PROFESSIONAL: 'professional',
  ENTERPRISE: 'enterprise'
};

// Demo users with different subscription levels
const DEMO_USERS = {
  'admin@dhstx.com': {
    password: 'admin123',
    user: {
      email: 'admin@dhstx.com',
      name: 'Administrator',
      role: 'admin',
      subscription: SUBSCRIPTION_TIERS.ENTERPRISE,
      features: {
        agents: 'unlimited',
        workflows: 'unlimited',
        connections: 'unlimited',
        analytics: true,
        portal: true,
        prioritySupport: true,
        teamLicenses: 'unlimited'
      }
    }
  },
  'user@example.com': {
    password: 'user123',
    user: {
      email: 'user@example.com',
      name: 'Free User',
      role: 'user',
      subscription: SUBSCRIPTION_TIERS.FREE,
      features: {
        agents: 1,
        workflows: 1,
        connections: 5,
        analytics: false,
        portal: false,
        prioritySupport: false,
        teamLicenses: 1
      }
    }
  }
};

export const login = (email, password) => {
  // Check demo users
  const demoUser = DEMO_USERS[email];
  if (demoUser && demoUser.password === password) {
    const user = {
      ...demoUser.user,
      id: Date.now().toString()
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return user;
  }
  
  // Fallback for any other credentials (demo mode)
  if (email && password) {
    const user = {
      email,
      name: email.split('@')[0],
      role: 'user',
      subscription: SUBSCRIPTION_TIERS.FREE,
      id: Date.now().toString(),
      features: {
        agents: 1,
        workflows: 1,
        connections: 5,
        analytics: false,
        portal: false,
        prioritySupport: false,
        teamLicenses: 1
      }
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return user;
  }
  return null;
};

export const logout = () => {
  localStorage.removeItem(AUTH_KEY);
};

export const getCurrentUser = () => {
  const stored = localStorage.getItem(AUTH_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  return null;
};

export const isAuthenticated = () => {
  return getCurrentUser() !== null;
};

export const hasFeature = (featureName) => {
  const user = getCurrentUser();
  if (!user || !user.features) {
    return false;
  }
  return user.features[featureName] === true || user.features[featureName] === 'unlimited';
};

export const getFeatureLimit = (featureName) => {
  const user = getCurrentUser();
  if (!user || !user.features) {
    return 0;
  }
  return user.features[featureName];
};

export const isSubscriptionTier = (tier) => {
  const user = getCurrentUser();
  return user && user.subscription === tier;
};

export const canUpgrade = () => {
  const user = getCurrentUser();
  return user && user.subscription !== SUBSCRIPTION_TIERS.ENTERPRISE;
};
