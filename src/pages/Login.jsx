/**
 * Login Page
 * User login with email/password and remember me
 */

import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import BackButton from '../components/BackButton';
import { useAuth } from '../contexts/AuthContext';
import { getAuthErrorMessage } from '../lib/auth/supabaseAuth';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signInWithOAuth } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Get the page user was trying to access
  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const { user, error: signInError } = await signIn(
        formData.email,
        formData.password,
        formData.rememberMe
      );

      if (signInError) {
        setError(getAuthErrorMessage(signInError));
        setLoading(false);
        return;
      }

      if (user) {
        // Redirect to the page they were trying to access, or dashboard
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(getAuthErrorMessage(err.message));
      setLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider) => {
    setError('');
    setLoading(true);

    try {
      const { error: oauthError } = await signInWithOAuth(provider);

      if (oauthError) {
        setError(getAuthErrorMessage(oauthError));
        setLoading(false);
        return;
      }

      // OAuth redirect will happen automatically
      // No need to navigate here
    } catch (err) {
      setError(getAuthErrorMessage(err.message));
      setLoading(false);
    }
  };

  useEffect(() => {
    // Ensure theme attribute/class syncs if user toggled elsewhere
    try {
      const t = localStorage.getItem('dhstx-theme') || localStorage.getItem('theme');
      if (t) {
        document.documentElement.setAttribute('data-theme', t);
        document.documentElement.classList.toggle('dark', t === 'dark');
      }
    } catch {}
  }, []);

  /* ========================================================
     Mobile portrait scroll lock:
     - Adds dhstx-no-scroll to html/body while in portrait and <= 640px.
     - Keeps desktop and landscape unaffected.
     - Cleans up on unmount and responds to orientation/resize.
     ======================================================== */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mq = window.matchMedia('(orientation: portrait) and (max-width: 640px)');

    const applyLock = (m) => {
      try {
        if (m.matches) {
          document.documentElement.classList.add('dhstx-no-scroll');
          document.body.classList.add('dhstx-no-scroll');
        } else {
          document.documentElement.classList.remove('dhstx-no-scroll');
          document.body.classList.remove('dhstx-no-scroll');
        }
      } catch (err) {
        // defensive: ignore
      }
    };

    // initial apply
    applyLock(mq);

    // Listen for changes in modern and older browsers
    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', applyLock);
    } else if (typeof mq.addListener === 'function') {
      mq.addListener(applyLock);
    }

    // cleanup on unmount
    return () => {
      try {
        if (typeof mq.removeEventListener === 'function') {
          mq.removeEventListener('change', applyLock);
        } else if (typeof mq.removeListener === 'function') {
          mq.removeListener(applyLock);
        }
      } finally {
        document.documentElement.classList.remove('dhstx-no-scroll');
        document.body.classList.remove('dhstx-no-scroll');
      }
    };
  }, []);

  return (
    <div className="themed-screen" style={{ padding: 16 }}>
      {/* Login header: back arrow + DHStx logo (left), theme toggle only (right) */}
      <div className="login-header" aria-hidden="false">
        <div className="header-left">
          <BackButton />
          <Link to="/" className="logo-btn" aria-label="DHStx Home">
            <span className="logo-text">DHStx</span>
            <span className="sr-only">DHStx</span>
          </Link>
        </div>
        <div className="header-right">
          <ThemeToggle inline className="theme-toggle" />
        </div>
      </div>
      <div className="themed-card login-card" style={{ width: 420, maxWidth: '100%' }}>
        <div className="login-card-brand" style={{ textAlign: 'center', marginBottom: 12 }}>
          <h1 className="brand-title" style={{ marginTop: 2 }}>Syntek Automations</h1>
          <p className="muted" style={{ marginTop: 6 }}>Access your organization's admin portal</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="alert-error" style={{ padding: '10px 12px', borderRadius: 8, marginBottom: 16 }}>
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="themed-label">EMAIL</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="themed-input"
              placeholder="you@example.com"
              required
              style={{ marginTop: 8, marginBottom: 16 }}
            />
          </div>

          <div>
            <label htmlFor="password" className="themed-label">PASSWORD</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="themed-input"
              placeholder="••••••••"
              required
              style={{ marginTop: 8 }}
            />
          </div>

          <div className="login-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                style={{ width: 16, height: 16 }}
              />
              <label htmlFor="rememberMe" className="muted" style={{ marginLeft: 8, fontSize: 14 }}>Remember me</label>
            </div>

            <Link to="/forgot-password" className="link-accent" style={{ fontSize: 14, fontWeight: 600 }}>
              Forgot password?
            </Link>
          </div>

          <button type="submit" disabled={loading} className="themed-button">
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <p className="muted" style={{ fontSize: 14 }}>
            Don't have an account?{' '}
            <Link to="/register" className="link-accent" style={{ fontWeight: 600 }}>Sign up</Link>
          </p>
        </div>

        <div style={{ marginTop: 16 }}>
          <div style={{ position: 'relative', textAlign: 'center', marginBottom: 12 }}>
            <span className="muted" style={{ fontSize: 13 }}>Or continue with</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <button
              type="button"
              onClick={() => handleOAuthSignIn('google')}
              disabled={loading}
              style={{
                width: '100%', display: 'inline-flex', justifyContent: 'center', alignItems: 'center',
                padding: '10px 12px', border: '1px solid var(--card-border)', borderRadius: 8, background: 'var(--card-bg)', color: 'var(--text)',
                opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              <svg style={{ width: 20, height: 20, marginRight: 8 }} viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>

            <button
              type="button"
              onClick={() => handleOAuthSignIn('github')}
              disabled={loading}
              style={{
                width: '100%', display: 'inline-flex', justifyContent: 'center', alignItems: 'center',
                padding: '10px 12px', border: '1px solid var(--card-border)', borderRadius: 8, background: 'var(--card-bg)', color: 'var(--text)',
                opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              <svg style={{ width: 20, height: 20, marginRight: 8 }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

