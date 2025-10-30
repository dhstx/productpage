import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import './App.css';
import './styles/team-members.css';

// Pages
import Landing from './pages/Landing';
import Product from './pages/Product';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AuthCallback from './pages/AuthCallback';
import Dashboard from './pages/Dashboard';
import AdminLayout from './components/AdminLayout';
import Platforms from './pages/Platforms';
import Team from './pages/Team';
import Billing from './pages/Billing';
import Settings from './pages/Settings';
import AgentManagement from './pages/AgentManagement';
import IntegrationsManagement from './pages/IntegrationsManagement';
import PricingPage from './pages/PricingPage';
import SubscriptionSuccess from './pages/SubscriptionSuccess';
import SubscriptionCancel from './pages/SubscriptionCancel';
import UseCaseHealthcare from './pages/UseCaseHealthcare';
import UseCaseEducation from './pages/UseCaseEducation';
import UseCaseNonprofit from './pages/UseCaseNonprofit';
import Security from './pages/Security';
import Integrations from './pages/Integrations';
import StatusLive from './pages/StatusLive';
import Changelog from './pages/Changelog';
import TermsOfService from './pages/policies/TermsOfService';
import PrivacyPolicy from './pages/policies/PrivacyPolicy';
import CookiePolicy from './pages/policies/CookiePolicy';
import MarginMonitoringDashboard from './pages/admin/MarginMonitoringDashboard';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import Analytics from './components/Analytics';
import ScrollHistoryManager from './components/ScrollHistoryManager';
import ScrollToTop from './components/ScrollToTop';

// Contexts
import { AuthProvider } from './contexts/AuthContext';

function App() {
  // Canonicalize site-wide banner and keep sticky under header
  useEffect(() => {
    if (typeof window === 'undefined') return; // SSR guard

    const selectors = [
      '.site-banner',
      '.dhstx-banner',
      '.banner',
      '.page-banner',
      '.founding-banner',
      '[data-banner]',
      '[role="banner"]'
    ];

    function findBanners() {
      const found = [];
      selectors.forEach(s => {
        try { document.querySelectorAll(s).forEach(n => found.push(n)); } catch (_) {}
      });
      return Array.from(new Set(found));
    }

    function canonicalize() {
      const nodes = findBanners();
      if (!nodes.length) return;

      // Prefer an already-labeled canonical element
      const preferred = nodes.find(n => n.classList && n.classList.contains('site-banner'));
      const canonical = preferred || nodes[0];

      try {
        // Move canonical right after top-level header to ensure sticky works
        const header = document.querySelector('header') || document.querySelector('.site-header') || null;
        if (header && canonical) {
          if (header.nextSibling !== canonical) header.parentNode.insertBefore(canonical, header.nextSibling);
        } else if (canonical && document.body.firstChild !== canonical) {
          // fallback: top of body
          document.body.insertBefore(canonical, document.body.firstChild);
        }

        // Ensure canonical class & enforce sticky in-flow inline (defensive: overrides bad inline fixed)
        canonical.classList.add('site-banner');

        // Force sticky positioning inline so it takes effect even if stylesheets lag
        canonical.style.position = 'sticky';
        canonical.style.top = 'calc(var(--site-header-height, 64px))';
        canonical.style.left = '0';
        canonical.style.right = '0';
        canonical.style.zIndex = '110';

        // compute final height and set variable
        const rect = canonical.getBoundingClientRect();
        const h = Math.max(Math.round(rect.height), 44);
        document.documentElement.style.setProperty('--site-banner-height', `${h}px`);

        // hide other banner nodes (non-destructive)
        nodes.forEach(n => {
          if (n !== canonical) {
            n.style.display = 'none';
            n.style.visibility = 'hidden';
            n.style.height = '0';
            n.style.margin = '0';
            n.style.padding = '0';
          }
        });

        // also hide any explicit fixed-position matched banners as backup
        const fixed = Array.from(document.querySelectorAll('[style*="position:fixed"], [style*="position: fixed"]'));
        fixed.forEach(n => {
          try {
            if (n !== canonical && selectors.some(s => n.matches && n.matches(s))) {
              n.style.display = 'none';
            }
          } catch (_) {}
        });
      } catch (err) {
        /* swallow: non-fatal */
      }
    }

    // run after interactive/load, and again shortly after to catch client-rendered banners
    const runNow = () => { canonicalize(); setTimeout(canonicalize, 600); };
    if (document.readyState === 'interactive' || document.readyState === 'complete') runNow();
    else document.addEventListener('DOMContentLoaded', runNow);

    // Observe body for SPA navigation / dynamic injection of banners
    const mo = new MutationObserver(() => canonicalize());
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      document.removeEventListener('DOMContentLoaded', runNow);
    };
  }, []);
  return (
    <Router>
      <AuthProvider>
        <Analytics />
        <ScrollHistoryManager />
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/product" element={<Product />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/use-cases/healthcare" element={<UseCaseHealthcare />} />
          <Route path="/use-cases/education" element={<UseCaseEducation />} />
          <Route path="/use-cases/nonprofit" element={<UseCaseNonprofit />} />
          <Route path="/security" element={<Security />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/status" element={<StatusLive />} />
          <Route path="/changelog" element={<Changelog />} />
          <Route path="/policies/terms" element={<TermsOfService />} />
          <Route path="/policies/privacy" element={<PrivacyPolicy />} />
          <Route path="/policies/cookies" element={<CookiePolicy />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/reset-password" element={<ResetPassword />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Subscription Routes */}
          <Route path="/subscription/success" element={<SubscriptionSuccess />} />
          <Route path="/subscription/cancel" element={<SubscriptionCancel />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Dashboard />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/platforms"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Platforms />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/team"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Team />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/billing"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Billing />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Settings />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/agents"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AgentManagement />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/integrations-management"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <IntegrationsManagement />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/margin-monitoring"
            element={
              <ProtectedRoute>
                <MarginMonitoringDashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

