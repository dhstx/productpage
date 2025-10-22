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

// Re-export functions with old names for compatibility
export const login = supabaseSignIn;
export const logout = supabaseSignOut;
export const getCurrentUser = supabaseGetCurrentUser;

export function isAuthenticated() {
  const user = supabaseGetCurrentUser();
  return !!user;
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
  const user = supabaseGetCurrentUser();
  if (!user) return false;
  
  const currentTier = user.subscription || 'free';
  return currentTier !== 'enterprise';
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
