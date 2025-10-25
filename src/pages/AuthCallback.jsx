/**
 * Auth Callback Page
 * Handles email verification and OAuth callbacks
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

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
    return (
      <div className="screen-center" role="status" aria-live="polite">
        <svg className="spinner-gold" viewBox="0 0 50 50" aria-hidden="true">
          <circle cx="25" cy="25" r="20" />
        </svg>
        <span className="sr-only">Logging in…</span>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
        <div className="card-surface p-8 text-center" role="alertdialog" aria-labelledby="auth-error-title">
          <div className="mb-4">
            <svg
              className="mx-auto h-16 w-16"
              style={{ color: '#ef4444' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 id="auth-error-title" className="text-2xl font-bold mb-2" style={{ color: 'var(--text)' }}>
            Verification Failed
          </h2>
          <p className="mb-6" style={{ color: 'var(--muted)' }}>
            {error || 'Unable to verify your email. The link may have expired.'}
          </p>
          <button onClick={() => navigate('/login')} className="btn-gold py-2 px-6 rounded-lg font-medium">
            Go to sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="screen-center" role="status" aria-live="polite">
      <svg className="spinner-gold" viewBox="0 0 50 50" aria-hidden="true">
        <circle cx="25" cy="25" r="20" />
      </svg>
      <span className="sr-only">Logging in…</span>
    </div>
  );
}

