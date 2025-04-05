// components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import Loader from './ui/loader';

export const ProtectedRoute = ({ requireAdmin = false }) => {
  const { user, loading, isAdmin, syncAuth } = useAuth();
  
  useEffect(() => {
    // Sync auth state when component mounts
    syncAuth();
  }, [syncAuth]);

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;