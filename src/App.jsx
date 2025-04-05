import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Loader from './components/ui/loader';
import './App.css';

// Logout component that handles the /logout route
const Logout = () => {
  const { logout, loading } = useAuth();
  
  useEffect(() => {
    if (!loading) {
      logout();
    }
  }, [logout, loading]);
  
  if (loading) {
    return <Loader />;
  }
  
  return <Navigate to="/" replace />;
};

// Public route component - redirects to dashboard if already authenticated
const PublicRoute = () => {
  const { user } = useAuth();
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <Outlet />;
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

// Separate component to use the auth context
function AppContent() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return <Loader />;
  }

  return (
    <Router>
      <main className=" bg-background">
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicRoute />}>
            <Route path="/" element={<LoginForm />} />
          </Route>
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard user={user} onLogout={logout} />} />
          </Route>
          
          {/* Special Routes */}
          <Route path="/logout" element={<Logout />} />
          
          {/* Catch-all route - redirect to home or dashboard based on auth status */}
          <Route path="*" element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/" replace />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;