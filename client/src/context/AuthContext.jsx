import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('eventsphere_token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize and fetch profile if token exists
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('eventsphere_token');
      if (storedToken) {
        try {
          const profile = await authService.getMe();
          setUser(profile);
        } catch (err) {
          console.warn('Session expired, clearing token');
          localStorage.removeItem('eventsphere_token');
          setToken(null);
          setUser(null);
        }
      } else {
        // By default, auto-login as Participant for instant interactive demo
        await switchDemoRole('Participant');
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      localStorage.setItem('eventsphere_token', data.token);
      setToken(data.token);
      setUser(data);
      return { success: true, user: data };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Login failed',
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const data = await authService.register(userData);
      localStorage.setItem('eventsphere_token', data.token);
      setToken(data.token);
      setUser(data);
      return { success: true, user: data };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Registration failed',
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

  // Demo Role Switcher helper
  const switchDemoRole = async (targetRole) => {
    setLoading(true);
    try {
      let email = 'participant@eventsphere.ai';
      if (targetRole === 'Organizer') {
        email = 'organizer@eventsphere.ai';
      } else if (targetRole === 'Volunteer') {
        email = 'volunteer@eventsphere.ai';
      }

      const data = await authService.login(email, 'password123');
      localStorage.setItem('eventsphere_token', data.token);
      setToken(data.token);
      setUser(data);
      return { success: true, user: data };
    } catch (err) {
      console.warn('Quick role switch note:', err.message);
      // Fallback local representation if backend is restarting
      const mockUserData = {
        name: targetRole === 'Organizer' ? 'Elena Rostova (Lead Organizer)' : 
              targetRole === 'Volunteer' ? 'Sofia Chen (Gate Marshal)' : 'Aarav Patel (VIP Attendee)',
        email: `${targetRole.toLowerCase()}@eventsphere.ai`,
        role: targetRole,
        _id: 'mock_user_' + targetRole.toLowerCase(),
      };
      setUser(mockUserData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        role: user?.role || 'Guest',
        login,
        register,
        logout,
        switchDemoRole,
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
