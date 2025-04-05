// context/AuthContext.jsx
import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { signOut } from '@/lib/supabase';
import { supabase } from '@/lib/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Function to synchronize authentication state - memoized to prevent unnecessary re-renders
  const syncAuth = useCallback(async () => {
    try {
      setAuthError(null);
      
      // First check localStorage for a stored user
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          
          // Verify the user still exists in database
          const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', parsedUser.email)
            .single();
            
          if (user && !error) {
            setUser(user);
            return user;
          }
          
          // If user not found or error, clear localStorage
          localStorage.removeItem('user');
        } catch (e) {
          // Handle JSON parse error or other issues
          console.error('Error parsing stored user:', e);
          localStorage.removeItem('user');
        }
      }
      
      // If no valid stored user, check with Supabase
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        setUser(null);
        return null;
      }
      
      if (session) {
        // Get corresponding user from our custom table
        const { data: user, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('email', session.user.email)
          .single();
          
        if (userError) {
          console.error('User fetch error:', userError);
          setUser(null);
          return null;
        }
        
        if (user) {
          // Update localStorage with fresh user data
          const userData = {
            id: user.id,
            email: user.email,
            role: user.role,
            full_name: user.full_name
          };
          
          localStorage.setItem('user', JSON.stringify(userData));
          setUser(user);
          return user;
        }
      }
      
      // No user found
      setUser(null);
      return null;
    } catch (error) {
      console.error('Error syncing auth:', error);
      setAuthError(error.message || 'Authentication error');
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    // Initial load of user
    async function initAuth() {
      setLoading(true);
      try {
        await syncAuth();
      } finally {
        setLoading(false);
      }
    }

    initAuth();

    // Set up auth state listener for Supabase Auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setLoading(true);
          try {
            await syncAuth();
          } finally {
            setLoading(false);
          }
        } else if (event === 'SIGNED_OUT') {
          localStorage.removeItem('user');
          setUser(null);
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, [syncAuth]);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setAuthError(null);
    
    try {
      // Import the signIn function dynamically to avoid circular dependencies
      const { signIn } = await import('@/lib/supabase');
      
      // Call the signIn function with email and password
      const { user: authUser } = await signIn({ email, password });
      
      if (authUser) {
        // Store user in localStorage
        const userData = {
          id: authUser.id,
          email: authUser.email,
          role: authUser.role,
          full_name: authUser.full_name
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(authUser);
        return authUser;
      }
      
      throw new Error('Authentication failed');
    } catch (error) {
      console.error('Login error:', error);
      setAuthError(error.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await signOut();
      localStorage.removeItem('user');
      setUser(null);
      return true;
    } catch (error) {
      console.error('Sign out error:', error);
      // Force clear even if there's an error
      localStorage.removeItem('user');
      setUser(null);
      return true;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    user,
    loading,
    login,
    logout,
    syncAuth,
    error: authError,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isManager: user?.role === 'manager',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};