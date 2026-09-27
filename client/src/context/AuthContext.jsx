import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('eventsphere_token') || null);
  const [loading, setLoading] = useState(true);

  // Global Auth Modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register'
  const [authModalInitialRole, setAuthModalInitialRole] = useState('Participant');

  // Initialize and verify profile if stored token exists
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('eventsphere_token');
      if (storedToken) {
        try {
          const profile = await authService.getMe();
          setUser(profile);
          setToken(storedToken);
        } catch (err) {
          console.warn('Stored token is invalid or expired, resetting session');
          localStorage.removeItem('eventsphere_token');
          setToken(null);
          setUser(null);
        }
      } else {
        setUser(null);
        setToken(null);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const openAuthModal = (mode = 'login', initialRole = 'Participant') => {
    setAuthModalMode(mode);
    setAuthModalInitialRole(initialRole);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // Real backend login against /api/auth/login
  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      localStorage.setItem('eventsphere_token', data.token);
      setToken(data.token);
      setUser(data);
      setIsAuthModalOpen(false);
      return { success: true, user: data };
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Login failed';
      return {
        success: false,
        message,
      };
    } finally {
      setLoading(false);
    }
  };

  // Real backend registration against /api/auth/register
  const register = async (userData) => {
    setLoading(true);
    try {
      const data = await authService.register(userData);
      localStorage.setItem('eventsphere_token', data.token);
      setToken(data.token);
      setUser(data);
      setIsAuthModalOpen(false);
      return { success: true, user: data };
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Registration failed';
      return {
        success: false,
        message,
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('eventsphere_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        role: user?.role || 'Guest',
        isAuthenticated: !!user,
        login,
        register,
        logout,
        // Modal Controls
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        authModalInitialRole,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
