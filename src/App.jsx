import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import './App.css';

// Pages (lazy-loaded for performance)
const Landing = lazy(() => import('./pages/Landing'));
const Product = lazy(() => import('./pages/Product'));
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Platforms = lazy(() => import('./pages/Platforms'));
const Team = lazy(() => import('./pages/Team'));
const Billing = lazy(() => import('./pages/Billing'));
const Settings = lazy(() => import('./pages/Settings'));
const AgentManagement = lazy(() => import('./pages/AgentManagement'));
const IntegrationsManagement = lazy(() => import('./pages/IntegrationsManagement'));
const UseCaseHealthcare = lazy(() => import('./pages/UseCaseHealthcare'));
const UseCaseEducation = lazy(() => import('./pages/UseCaseEducation'));
const UseCaseNonprofit = lazy(() => import('./pages/UseCaseNonprofit'));
const Security = lazy(() => import('./pages/Security'));
const Integrations = lazy(() => import('./pages/Integrations'));
const StatusLive = lazy(() => import('./pages/StatusLive'));
const Changelog = lazy(() => import('./pages/Changelog'));
const TermsOfService = lazy(() => import('./pages/policies/TermsOfService'));
const PrivacyPolicy = lazy(() => import('./pages/policies/PrivacyPolicy'));
const CookiePolicy = lazy(() => import('./pages/policies/CookiePolicy'));

// Components
import ProtectedRoute from './components/ProtectedRoute';
import PublicLayout from './components/PublicLayout';
const Pricing = lazy(() => import('./pages/Pricing'));
const Contact = lazy(() => import('./pages/Contact'));
const StrategicPlanning = lazy(() => import('./pages/features/StrategicPlanning'));
const MemberEngagement = lazy(() => import('./pages/features/MemberEngagement'));
const EventManagement = lazy(() => import('./pages/features/EventManagement'));
const AIPoweredInsights = lazy(() => import('./pages/features/AIPoweredInsights'));
import Analytics from './components/Analytics';
import ScrollHistoryManager from './components/ScrollHistoryManager';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <Router>
      <Analytics />
      <ScrollHistoryManager />
      <ScrollToTop />
      <Suspense fallback={<div className="mx-auto max-w-screen-xl px-4 md:px-8 py-12 text-[#B3B3B3]">Loading…</div>}>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/product" element={<Product />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/security" element={<Security />} />
          <Route path="/status" element={<StatusLive />} />
          <Route path="/changelog" element={<Changelog />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/features/strategic-planning" element={<StrategicPlanning />} />
          <Route path="/features/member-engagement" element={<MemberEngagement />} />
          <Route path="/features/event-management" element={<EventManagement />} />
          <Route path="/features/ai-powered-insights" element={<AIPoweredInsights />} />
          <Route path="/use-cases/healthcare" element={<UseCaseHealthcare />} />
          <Route path="/use-cases/education" element={<UseCaseEducation />} />
          <Route path="/use-cases/nonprofit" element={<UseCaseNonprofit />} />
          <Route path="/policies/terms" element={<TermsOfService />} />
          <Route path="/policies/privacy" element={<PrivacyPolicy />} />
          <Route path="/policies/cookies" element={<CookiePolicy />} />
        </Route>
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
      </Suspense>
    </Router>
  );
}

export default App;
