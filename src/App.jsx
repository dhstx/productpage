import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Pages
import Landing from './pages/Landing';
import Product from './pages/Product';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Platforms from './pages/Platforms';
import Team from './pages/Team';
import Billing from './pages/Billing';
import Settings from './pages/Settings';
import UseCaseHealthcare from './pages/UseCaseHealthcare';
import Security from './pages/Security';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import Analytics from './components/Analytics';

function App() {
  return (
    <Router>
      <Analytics />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/product" element={<Product />} />
        <Route path="/use-cases/healthcare" element={<UseCaseHealthcare />} />
        <Route path="/security" element={<Security />} />
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

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
