// Production-ready authentication utilities using backend JWT

import { getFeatureLimit as getTierFeatureLimit, canAccessFeature } from './pricing';

const AUTH_TOKEN_KEY = 'authToken';
const AUTH_USER_KEY = 'authUser';

// Expose subscription tier identifiers for UI code
export const SUBSCRIPTION_TIERS = {
  FREE: 'free',
  STARTER: 'starter',
  PROFESSIONAL: 'professional',
  ENTERPRISE: 'enterprise',
};

export async function login(email, password) {
  if (!email || !password) return null;

  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  const { token, user } = data || {};
  if (!token || !user) return null;

  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  return user;
}

export function logout() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

export function getToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function getCurrentUser() {
  const stored = localStorage.getItem(AUTH_USER_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export async function refreshCurrentUser() {
  const token = getToken();
  if (!token) return null;
  try {
    const response = await fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) {
      if (response.status === 401) logout();
      return null;
    }
    const payload = await response.json();
    // Persist only the user object; subscription is used for feature checks
    if (payload?.user) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(payload.user));
    }
    return payload?.user || null;
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return Boolean(getToken());
}

// Feature helpers based on pricing tiers; best-effort using cached user
export function hasFeature(featureName) {
  const user = getCurrentUser();
  if (!user) return false;
  // If user has an explicit features object (legacy), honor it
  if (user.features) {
    const value = user.features[featureName];
    return value === true || value === 'unlimited';
  }
  // Fallback by tier if present on user
  const tierId = user.subscription?.plan_id || user.subscriptionTier || 'free';
  return canAccessFeature(tierId, featureName);
}

export function getFeatureLimit(featureName) {
  const user = getCurrentUser();
  if (!user) return 0;
  if (user.features) {
    return user.features[featureName] ?? 0;
  }
  const tierId = user.subscription?.plan_id || user.subscriptionTier || 'free';
  return getTierFeatureLimit(tierId, featureName) ?? 0;
}

export function isSubscriptionTier(tier) {
  const user = getCurrentUser();
  if (!user) return false;
  const current = user.subscription?.plan_id || user.subscriptionTier || 'free';
  return current === tier;
}

export function canUpgrade() {
  const user = getCurrentUser();
  if (!user) return true;
  const current = user.subscription?.plan_id || user.subscriptionTier || 'free';
  return current !== 'enterprise';
}
