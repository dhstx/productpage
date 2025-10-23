/**
 * Auth Context
 * Provides authentication state and methods throughout the app
 */

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  signIn as supabaseSignIn,
  signUp as supabaseSignUp,
  signOut as supabaseSignOut,
  signInWithOAuth as supabaseSignInWithOAuth,
  getCurrentUser,
  getSession,
  refreshSession,
  onAuthStateChange,
  getUserProfile,
  isRememberMeEnabled,
} from '../lib/auth/supabaseAuth';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state
  useEffect(() => {
    initializeAuth();
  }, []);

  // Set up auth state listener
  useEffect(() => {
    const subscription = onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        // Fetch user profile
        const { profile: userProfile } = await getUserProfile(session.user.id);
        setProfile(userProfile);
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Set up session refresh
  useEffect(() => {
    if (!session) return;

    // Refresh session every 55 minutes (tokens expire after 60 minutes)
    const refreshInterval = setInterval(async () => {
      console.log('Refreshing session...');
      const { session: newSession } = await refreshSession();
      if (newSession) {
        setSession(newSession);
        setUser(newSession.user);
      }
    }, 55 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, [session]);

  async function initializeAuth() {
    try {
      setLoading(true);
      
      // Check if remember me is enabled
      const rememberMe = isRememberMeEnabled();
      
      if (!rememberMe) {
        // If remember me is not enabled, clear session on page load
        // (This simulates session-only auth)
        const { session: currentSession } = await getSession();
        if (!currentSession) {
          setLoading(false);
          return;
        }
      }

      // Get current session
      const { session: currentSession } = await getSession();
      setSession(currentSession);
      
      if (currentSession?.user) {
        setUser(currentSession.user);
        
        // Fetch user profile
        const { profile: userProfile } = await getUserProfile(currentSession.user.id);
        setProfile(userProfile);
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function signIn(email, password, rememberMe = false) {
    try {
      setLoading(true);
      setError(null);
      
      const { user: authUser, session: authSession, error: authError } = 
        await supabaseSignIn(email, password, rememberMe);

      if (authError) {
        setError(authError);
        return { user: null, error: authError };
      }

      setUser(authUser);
      setSession(authSession);

      // Fetch user profile
      if (authUser) {
        const { profile: userProfile } = await getUserProfile(authUser.id);
        setProfile(userProfile);
      }

      return { user: authUser, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      setError(error.message);
      return { user: null, error: error.message };
    } finally {
      setLoading(false);
    }
  }

  async function signUp(email, password, metadata = {}) {
    try {
      setLoading(true);
      setError(null);
      
      const { user: authUser, session: authSession, error: authError } = 
        await supabaseSignUp(email, password, metadata);

      if (authError) {
        setError(authError);
        return { user: null, error: authError };
      }

      setUser(authUser);
      setSession(authSession);

      // Fetch user profile
      if (authUser) {
        const { profile: userProfile } = await getUserProfile(authUser.id);
        setProfile(userProfile);
      }

      return { user: authUser, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      setError(error.message);
      return { user: null, error: error.message };
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    try {
      setLoading(true);
      setError(null);
      
      const { error: authError } = await supabaseSignOut();

      if (authError) {
        setError(authError);
        return { error: authError };
      }

      setUser(null);
      setSession(null);
      setProfile(null);

      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      setError(error.message);
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  }

  async function signInWithOAuth(provider) {
    try {
      setLoading(true);
      setError(null);
      
      const { error: authError } = await supabaseSignInWithOAuth(provider);

      if (authError) {
        setError(authError);
        return { error: authError };
      }

      // OAuth redirect will happen automatically
      // User state will be updated via onAuthStateChange after redirect
      return { error: null };
    } catch (error) {
      console.error('OAuth sign in error:', error);
      setError(error.message);
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  }

  const value = {
    user,
    profile,
    session,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    signInWithOAuth,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

