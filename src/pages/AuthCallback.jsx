/**
 * Auth Callback Page
 * Handles email verification and OAuth callbacks
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Gear from '../components/graphics/Gear.jsx';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    handleCallback();
  }, []);

  async function handleCallback() {
    try {
      // Get the hash from the URL
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      const type = hashParams.get('type');

      if (!accessToken) {
        throw new Error('No access token found');
      }

      // Set the session
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (sessionError) throw sessionError;

      // Handle different callback types
      if (type === 'signup') {
        setStatus('success');
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 2000);
      } else if (type === 'recovery') {
        navigate('/auth/reset-password', { replace: true });
      } else {
        setStatus('success');
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 2000);
      }
    } catch (err) {
      console.error('Auth callback error:', err);
      setError(err.message);
      setStatus('error');
    }
  }

  if (status === 'loading') {
    // Plain themed "Logging in..." text only (no spinners/cogs)
    return (
      <div className="themed-screen" role="status" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>Logging in...</div>
          <span className="sr-only">Logging in…</span>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-4">
            <svg
              className="mx-auto h-16 w-16 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Verification Failed
          </h2>
          <p className="text-gray-600 mb-6">
            {error || 'Unable to verify your email. The link may have expired.'}
          </p>
          <button
            onClick={() => navigate('/login')}
            className="inline-block bg-blue-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Go to sign in
          </button>
        </div>
      </div>
    );
  }

  // Success state: keep logic and show same plain text while redirect occurs
  return (
    <div className="themed-screen" role="status" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>Logging in...</div>
        <span className="sr-only">Logging in…</span>
      </div>
    </div>
  );
}

