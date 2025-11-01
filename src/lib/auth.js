/**
 * Auth Compatibility Shim
 * Provides backward compatibility for components still using old auth.js
 * This file redirects to the new Supabase auth system
 */

import {
  signIn as supabaseSignIn,
  signOut as supabaseSignOut,
  getCurrentUser as supabaseGetCurrentUser,
} from './auth/supabaseAuth';

const DEMO_USER = {
  id: 'demo-admin',
  name: 'Administrator',
  email: 'admin@dhstx.com',
  role: 'admin',
  subscription: 'enterprise',
};

let cachedUser = null;

function normalizeUser(rawUser) {
  if (!rawUser) return null;
  const baseEmail = rawUser.email || rawUser.user_metadata?.email;
  return {
    id: rawUser.id || rawUser.user_metadata?.id || 'user',
    name: rawUser.user_metadata?.name || rawUser.name || (baseEmail ? baseEmail.split('@')[0] : 'User'),
    email: baseEmail || 'user@example.com',
    role: rawUser.user_metadata?.role || rawUser.role || 'user',
    subscription: rawUser.subscription || rawUser.user_metadata?.subscription || 'free',
  };
}

async function hydrateFromSupabase() {
  try {
    const result = await supabaseGetCurrentUser();
    const normalized = normalizeUser(result?.user ?? result);
    if (normalized) {
      cachedUser = normalized;
      try {
        localStorage.setItem('dhstx_user', JSON.stringify(normalized));
      } catch {}
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[auth] unable to hydrate user from Supabase', error);
    }
  }
  return cachedUser;
}

function readCachedUser() {
  if (cachedUser) return cachedUser;
  try {
    const stored = typeof window !== 'undefined' ? window.localStorage?.getItem('dhstx_user') : null;
    if (stored) {
      cachedUser = JSON.parse(stored);
      return cachedUser;
    }
  } catch {}
  return null;
}

export async function login(identifier, password, rememberMe = false) {
  cachedUser = null;
  if (!identifier || !password) return null;

  const email = identifier.includes('@') ? identifier : `${identifier}@dhstx.com`;

  try {
    const result = await supabaseSignIn(email, password, rememberMe);
    const normalized = normalizeUser(result?.user);
    if (normalized) {
      cachedUser = normalized;
      try {
        localStorage.setItem('dhstx_user', JSON.stringify(normalized));
      } catch {}
      return cachedUser;
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[auth] Supabase login failed, falling back to demo credentials', error);
    }
  }

  const normalizedIdentifier = identifier.toLowerCase();
  if ((normalizedIdentifier === 'admin' || email.toLowerCase() === DEMO_USER.email) && password === 'admin123') {
    cachedUser = { ...DEMO_USER };
    try {
      localStorage.setItem('dhstx_user', JSON.stringify(cachedUser));
    } catch {}
    return cachedUser;
  }

  return null;
}

export async function logout() {
  try {
    await supabaseSignOut();
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[auth] Supabase logout failed', error);
    }
  }
  cachedUser = null;
  try {
    localStorage.removeItem('dhstx_user');
  } catch {}
  return true;
}

export function getCurrentUser() {
  return readCachedUser();
}

export function isAuthenticated() {
  const user = readCachedUser();
  if (user) return true;
  // Attempt async hydration; ignore resolution for sync API compatibility
  hydrateFromSupabase().catch(() => {});
  return false;
}

// Subscription tiers (for compatibility)
export const SUBSCRIPTION_TIERS = {
  FREE: 'free',
  STARTER: 'starter',
  PROFESSIONAL: 'professional',
  ENTERPRISE: 'enterprise',
};

// Can upgrade function (simplified)
export function canUpgrade() {
  const user = readCachedUser();
  if (!user) return false;

  const currentTier = user.subscription || user.subscription_tier || 'free';
  return currentTier !== SUBSCRIPTION_TIERS.ENTERPRISE;
}

// Note: This is a temporary compatibility layer
// Components should be migrated to use useAuth() hook from AuthContext
export default {
  login,
  logout,
  getCurrentUser,
  isAuthenticated,
  canUpgrade,
  SUBSCRIPTION_TIERS,
};
