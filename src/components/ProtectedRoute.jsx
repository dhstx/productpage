import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../lib/auth';
import AdminLayout from './AdminLayout';

export default function ProtectedRoute({ children }) {
  const authed = isAuthenticated();
  if (!authed) return <Navigate to="/login" replace />;
  return <AdminLayout>{children}</AdminLayout>;
}
