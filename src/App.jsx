import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import { AgentEnabledProvider } from '@/features/agents/agentEnabledStore';

function App() {
  return (
    <Router>
      <AgentEnabledProvider>
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
      </AgentEnabledProvider>
    </Router>
  );
}

export default App;

