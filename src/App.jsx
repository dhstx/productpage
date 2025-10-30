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
  // --- start snippet ---
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

    function collectNodes() {
      const out = [];
      selectors.forEach(s => {
        try { document.querySelectorAll(s).forEach(n => out.push(n)); } catch (e) {}
      });
      return Array.from(new Set(out));
    }

    function makeCloneFrom(node) {
      // deep clone, but strip problematic attributes and inline fixed position
      const clone = node.cloneNode(true);
      // Remove ids that could collide
      clone.removeAttribute('id');
      // Clean inline style that may force fixed position
      clone.style.position = '';
      clone.style.top = '';
      clone.style.left = '';
      clone.style.right = '';
      clone.style.zIndex = '';
      // Ensure canonical class
      clone.classList.add('site-banner');
      clone.id = 'site-banner-clone';
      return clone;
    }

    function canonicalize() {
      try {
        const nodes = collectNodes();
        if (!nodes.length) return;

        // Prefer an already-labeled site-banner
        const preferred = nodes.find(n => n.classList && n.classList.contains('site-banner'));
        const source = preferred || nodes[0];
        if (!source) return;

        // If a clone already exists, update it; otherwise create it
        let clone = document.getElementById('site-banner-clone');
        if (!clone) {
          clone = makeCloneFrom(source);
          // Insert clone after top-level header
          const header = document.querySelector('header') || document.querySelector('.site-header') || document.body.firstChild;
          if (header && header.parentNode) {
            if (header.nextSibling) header.parentNode.insertBefore(clone, header.nextSibling);
            else header.parentNode.appendChild(clone);
          } else {
            document.body.insertBefore(clone, document.body.firstChild);
          }
        } else {
          // Update clone's content to reflect source
          clone.innerHTML = source.innerHTML;
          // ensure classes are present
          clone.classList.add('site-banner');
        }

        // Force sticky inline (defensive)
        clone.style.position = 'sticky';
        clone.style.top = 'calc(var(--site-header-height, 64px))';
        clone.style.left = '0';
        clone.style.right = '0';
        clone.style.zIndex = '110';

        // Compute height and set CSS var for main spacing
        const rect = clone.getBoundingClientRect();
        const h = Math.max(Math.round(rect.height), 44);
        document.documentElement.style.setProperty('--site-banner-height', `${h}px`);

        // Hide all original banner nodes (non-destructive)
        nodes.forEach(n => {
          if (n !== source) {
            try {
              n.style.display = 'none';
              n.style.visibility = 'hidden';
              n.style.height = '0';
              n.style.margin = '0';
              n.style.padding = '0';
            } catch (e) {}
          } else {
            // hide the original source as well; clone is now authoritative
            try {
              n.style.display = 'none';
              n.style.visibility = 'hidden';
              n.style.height = '0';
              n.style.margin = '0';
              n.style.padding = '0';
            } catch (e) {}
          }
        });

        // Remove other fixed banners that match selectors (safety)
        document.querySelectorAll('[style*="position:fixed"], [style*="position: fixed"]').forEach(n => {
          try {
            if (n.id !== 'site-banner-clone' && selectors.some(s => n.matches && n.matches(s))) {
              n.style.display = 'none';
            }
          } catch (e) {}
        });

      } catch (err) {
        // non-fatal
        console.warn('Banner canonicalization failed', err);
      }
    }

    // run initial canonicalization after DOM ready and after a small delay (for client-rendered banners)
    const runNow = () => { canonicalize(); setTimeout(canonicalize, 750); };
    if (document.readyState === 'interactive' || document.readyState === 'complete') runNow();
    else document.addEventListener('DOMContentLoaded', runNow);

    // Observe mutations so SPA navigation / lazy injection is handled
    const mo = new MutationObserver(() => canonicalize());
    mo.observe(document.body, { childList: true, subtree: true });

    // Recompute clone height on window resize/zoom
    const onResize = () => {
      const clone = document.getElementById('site-banner-clone');
      if (clone) {
        const rect = clone.getBoundingClientRect();
        const h = Math.max(Math.round(rect.height), 44);
        document.documentElement.style.setProperty('--site-banner-height', `${h}px`);
      }
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);

    return () => {
      mo.disconnect();
      document.removeEventListener('DOMContentLoaded', runNow);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, []);
  // --- end snippet ---
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

