/**
 * Supabase Authentication Service
 * Handles all authentication operations including:
 * - Email/password auth
 * - Password reset
 * - Session management
 * - Remember me functionality
 */

import { supabase } from '../supabase';

// ============================================================================
// AUTHENTICATION
// ============================================================================

/**
 * Sign up a new user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {object} metadata - Additional user metadata (name, etc.)
 * @returns {Promise<{user, session, error}>}
 */
export async function signUp(email, password, metadata = {}) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;

    // Create user record in users table
    if (data.user) {
      const { error: dbError } = await supabase
        .from('users')
        .insert([
          {
            id: data.user.id,
            email: data.user.email,
            subscription_tier: 'freemium',
            created_at: new Date().toISOString(),
          },
        ]);

      if (dbError) {
        console.error('Error creating user record:', dbError);
      }
    }

    return { user: data.user, session: data.session, error: null };
  } catch (error) {
    console.error('Sign up error:', error);
    return { user: null, session: null, error: error.message };
  }
}

/**
 * Sign in with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {boolean} rememberMe - Whether to persist session
 * @returns {Promise<{user, session, error}>}
 */
export async function signIn(email, password, rememberMe = false) {
  try {
    // Set session persistence based on rememberMe
    if (rememberMe) {
      await supabase.auth.setSession({
        access_token: null,
        refresh_token: null,
      });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Store remember me preference
    if (rememberMe) {
      localStorage.setItem('dhstx_remember_me', 'true');
    } else {
      localStorage.removeItem('dhstx_remember_me');
    }

    return { user: data.user, session: data.session, error: null };
  } catch (error) {
    console.error('Sign in error:', error);
    return { user: null, session: null, error: error.message };
  }
}

/**
 * Sign out the current user
 * @returns {Promise<{error}>}
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    
    // Clear remember me preference
    localStorage.removeItem('dhstx_remember_me');
    
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Sign out error:', error);
    return { error: error.message };
  }
}

// ============================================================================
// PASSWORD MANAGEMENT
// ============================================================================

/**
 * Send password reset email
 * @param {string} email - User email
 * @returns {Promise<{error}>}
 */
export async function sendPasswordResetEmail(email) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Password reset error:', error);
    return { error: error.message };
  }
}

/**
 * Update user password
 * @param {string} newPassword - New password
 * @returns {Promise<{error}>}
 */
export async function updatePassword(newPassword) {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Update password error:', error);
    return { error: error.message };
  }
}

// ============================================================================
// SESSION MANAGEMENT
// ============================================================================

/**
 * Get current user session
 * @returns {Promise<{session, error}>}
 */
export async function getSession() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return { session: data.session, error: null };
  } catch (error) {
    console.error('Get session error:', error);
    return { session: null, error: error.message };
  }
}

/**
 * Get current user
 * @returns {Promise<{user, error}>}
 */
export async function getCurrentUser() {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return { user: data.user, error: null };
  } catch (error) {
    console.error('Get user error:', error);
    return { user: null, error: error.message };
  }
}

/**
 * Refresh the current session
 * @returns {Promise<{session, error}>}
 */
export async function refreshSession() {
  try {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) throw error;
    return { session: data.session, error: null };
  } catch (error) {
    console.error('Refresh session error:', error);
    return { session: null, error: error.message };
  }
}

/**
 * Check if user is authenticated
 * @returns {Promise<boolean>}
 */
export async function isAuthenticated() {
  const { session } = await getSession();
  return session !== null;
}

/**
 * Set up auth state change listener
 * @param {function} callback - Callback function to handle auth state changes
 * @returns {object} Subscription object with unsubscribe method
 */
export function onAuthStateChange(callback) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      callback(event, session);
    }
  );

  return subscription;
}

// ============================================================================
// USER PROFILE MANAGEMENT
// ============================================================================

/**
 * Get user profile from database
 * @param {string} userId - User ID
 * @returns {Promise<{profile, error}>}
 */
export async function getUserProfile(userId) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return { profile: data, error: null };
  } catch (error) {
    console.error('Get user profile error:', error);
    return { profile: null, error: error.message };
  }
}

/**
 * Update user profile
 * @param {string} userId - User ID
 * @param {object} updates - Profile updates
 * @returns {Promise<{profile, error}>}
 */
export async function updateUserProfile(userId, updates) {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return { profile: data, error: null };
  } catch (error) {
    console.error('Update user profile error:', error);
    return { profile: null, error: error.message };
  }
}

/**
 * Update user metadata (name, avatar, etc.)
 * @param {object} metadata - User metadata
 * @returns {Promise<{user, error}>}
 */
export async function updateUserMetadata(metadata) {
  try {
    const { data, error } = await supabase.auth.updateUser({
      data: metadata,
    });

    if (error) throw error;
    return { user: data.user, error: null };
  } catch (error) {
    console.error('Update user metadata error:', error);
    return { user: null, error: error.message };
  }
}

// ============================================================================
// REMEMBER ME FUNCTIONALITY
// ============================================================================

/**
 * Check if remember me is enabled
 * @returns {boolean}
 */
export function isRememberMeEnabled() {
  return localStorage.getItem('dhstx_remember_me') === 'true';
}

/**
 * Set remember me preference
 * @param {boolean} enabled - Whether to enable remember me
 */
export function setRememberMe(enabled) {
  if (enabled) {
    localStorage.setItem('dhstx_remember_me', 'true');
  } else {
    localStorage.removeItem('dhstx_remember_me');
  }
}

// ============================================================================
// EMAIL VERIFICATION
// ============================================================================

/**
 * Resend verification email
 * @param {string} email - User email
 * @returns {Promise<{error}>}
 */
export async function resendVerificationEmail(email) {
  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Resend verification email error:', error);
    return { error: error.message };
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get user subscription tier
 * @param {string} userId - User ID
 * @returns {Promise<{tier, error}>}
 */
export async function getUserTier(userId) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('subscription_tier')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return { tier: data.subscription_tier, error: null };
  } catch (error) {
    console.error('Get user tier error:', error);
    return { tier: null, error: error.message };
  }
}

/**
 * Check if user has a specific feature
 * @param {string} userId - User ID
 * @param {string} feature - Feature name
 * @returns {Promise<boolean>}
 */
export async function hasFeature(userId, feature) {
  const { tier } = await getUserTier(userId);
  if (!tier) return false;

  // Get tier features from subscription_tiers table
  const { data, error } = await supabase
    .from('subscription_tiers')
    .select('features')
    .eq('tier', tier)
    .single();

  if (error || !data) return false;

  return data.features[feature] === true;
}

// ============================================================================
// ERROR HELPERS
// ============================================================================

/**
 * Get user-friendly error message
 * @param {string} error - Error message from Supabase
 * @returns {string} User-friendly error message
 */
export function getAuthErrorMessage(error) {
  const errorMap = {
    'Invalid login credentials': 'Invalid email or password. Please try again.',
    'Email not confirmed': 'Please verify your email address before signing in.',
    'User already registered': 'An account with this email already exists.',
    'Password should be at least 6 characters': 'Password must be at least 6 characters long.',
    'Unable to validate email address: invalid format': 'Please enter a valid email address.',
    'Email rate limit exceeded': 'Too many requests. Please try again later.',
  };

  return errorMap[error] || error || 'An unexpected error occurred. Please try again.';
}

