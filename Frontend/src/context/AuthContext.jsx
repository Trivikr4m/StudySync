import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize and verify user on mount or token change
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        // Only trigger loading state if user is not already set in context
        if (!user) {
          setLoading(true);
        }
        try {
          // Fetch user profile info from backend
          const res = await API.get('/api/users/profile');
          // ApiResponse format is standard { success: boolean, message: string, data: T }
          if (res.data && res.data.success) {
            setUser(res.data.data);
          } else {
            // Invalid data format, clear tokens
            logout();
          }
        } catch (err) {
          console.error("Token verification failed", err);
          logout();
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    initializeAuth();
  }, [token]);

  // Login handler
  const login = async (email, password) => {
    try {
      const res = await API.post('/api/auth/login', { email, password });
      if (res.data && res.data.success) {
        const { token: jwtToken, id, name, email: userEmail, role, department, year } = res.data.data;
        localStorage.setItem('token', jwtToken);
        // Set user details immediately to prevent navigation redirect race condition
        setUser({ id, name, email: userEmail, role, department, year });
        // We set token state which will trigger the useEffect to fetch user details
        setToken(jwtToken);
        return { success: true, message: res.data.message };
      }
      return { success: false, message: res.data.message || 'Login failed' };
    } catch (err) {
      console.error("Login error", err);
      const errorMsg = err.response?.data?.message || 'Invalid email or password';
      return { success: false, message: errorMsg };
    }
  };

  // Register handler
  const register = async (userData) => {
    try {
      const res = await API.post('/api/auth/register', userData);
      if (res.data && res.data.success) {
        const { token: jwtToken, id, name, email: userEmail, role, department, year } = res.data.data;
        localStorage.setItem('token', jwtToken);
        // Set user details immediately to prevent navigation redirect race condition
        setUser({ id, name, email: userEmail, role, department, year });
        setToken(jwtToken);
        return { success: true, message: res.data.message };
      }
      return { success: false, message: res.data.message || 'Registration failed' };
    } catch (err) {
      console.error("Registration error", err);
      const errorMsg = err.response?.data?.message || 'Registration failed. Check your fields.';
      return { success: false, message: errorMsg };
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
  };

  // Profile update handler to keep local context state in sync
  const updateUserProfileState = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateUserProfileState,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
