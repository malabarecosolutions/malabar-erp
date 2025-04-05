// lib/supabase.js
import { supabase } from '@/lib/supabaseClient';
import bcrypt from 'bcryptjs';

/**
 * Sign in with email and password using custom users table
 * @param {Object} credentials - User credentials
 * @param {string} credentials.email - User email
 * @param {string} credentials.password - User password
 * @returns {Promise<Object>} - Returns user object and session
 */
export async function signIn({ email, password }) {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  try {
    // Fetch user from custom users table
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (userError || !user) {
      throw new Error('Invalid login credentials');
    }

    // Verify password using bcrypt
    const passwordMatch = await bcrypt.compare(password, user.encrypted_password);

    if (!passwordMatch) {
      throw new Error('Invalid login credentials');
    }

    // Create a session using Supabase auth (optional but recommended for token management)
    // Note: This requires auth.email column to match your custom users table email
    const { data: sessionData, error: sessionError } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase(),
      password: password
    });

    if (sessionError) {
      // Fall back to custom session if Supabase auth fails
      // Store user in localStorage as a basic session mechanism
      localStorage.setItem('user', JSON.stringify({
        id: user.id,
        email: user.email,
        role: user.role,
        full_name: user.full_name
      }));
      
      return { user, session: null };
    }

    return { user, session: sessionData.session };
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
}

/**
 * Sign out current user
 */
export async function signOut() {
  try {
    // Clear Supabase session
    await supabase.auth.signOut();
    
    // Clear localStorage session
    localStorage.removeItem('user');
    
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}

/**
 * Get current user from either Supabase auth or localStorage
 * @returns {Promise<Object|null>} - Returns user object or null
 */
export async function getCurrentUser() {
  try {
    // First check localStorage for existing session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      
      // Verify the user still exists in database
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', parsedUser.email)
        .single();
        
      if (user && !error) return user;
      localStorage.removeItem('user');
    }
    
    // Then check Supabase auth session
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (session && !error) {
      // Get corresponding user from our custom table
      const { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('email', session.user.email)
        .single();
        
      if (user) {
        // Update localStorage with fresh user data
        localStorage.setItem('user', JSON.stringify({
          id: user.id,
          email: user.email,
          role: user.role,
          full_name: user.full_name
        }));
        return user;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Check if user has a specific role
 * @param {string} role - Role to check ('admin' or 'manager')
 * @returns {Promise<boolean>} - Returns true if user has the role
 */
export async function hasRole(role) {
  const user = await getCurrentUser();
  return user && user.role === role;
}