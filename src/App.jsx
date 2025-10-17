import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import './styles/product-cogs-v2.css';

// Pages
import Landing from './pages/Landing';
import Product from './pages/Product';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Platforms from './pages/Platforms';
import Team from './pages/Team';
import Billing from './pages/Billing';
import Settings from './pages/Settings';
import AgentManagement from './pages/AgentManagement';
import IntegrationsManagement from './pages/IntegrationsManagement';
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

// Components
import ProtectedRoute from './components/ProtectedRoute';
import Analytics from './components/Analytics';
import ScrollHistoryManager from './components/ScrollHistoryManager';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <Router>
      <Analytics />
      <ScrollHistoryManager />
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/product" element={<Product />} />
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
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/platforms"
          element={
            <ProtectedRoute>
              <Platforms />
            </ProtectedRoute>
          }
        />
        <Route
          path="/team"
          element={
            <ProtectedRoute>
              <Team />
            </ProtectedRoute>
          }
        />
        <Route
          path="/billing"
          element={
            <ProtectedRoute>
              <Billing />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agents"
          element={
            <ProtectedRoute>
              <AgentManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/integrations-management"
          element={
            <ProtectedRoute>
              <IntegrationsManagement />
            </ProtectedRoute>
          }
        />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
