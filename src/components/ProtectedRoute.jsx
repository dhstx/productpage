/**
 * Protected Route Component
 * Redirects to login if user is not authenticated
 * Uses Supabase Auth Context
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { isHelpSafeMode, isDevEnvironment } from '@/lib/helpSafeMode';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Dev diagnostics for User Manual access decisions
  if (isDevEnvironment() && location.pathname.startsWith('/user-manual')) {
    // eslint-disable-next-line no-console
    console.warn('[help][guard] route check', {
      path: location.pathname,
      loading,
      userPresent: !!user,
      safeMode: isHelpSafeMode(),
    });
  }

  // Safe Mode: allow access to /user-manual without redirect (content-only)
  if (location.pathname.startsWith('/user-manual') && isHelpSafeMode()) {
    if (isDevEnvironment()) {
      // eslint-disable-next-line no-console
      console.warn('[help][guard] Safe Mode ON — allowing /user-manual without auth');
    }
    return children;
  }

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    if (isDevEnvironment() && location.pathname.startsWith('/user-manual')) {
      // eslint-disable-next-line no-console
      console.warn('[help][guard] redirecting to /login for /user-manual');
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render protected content
  return children;
}

