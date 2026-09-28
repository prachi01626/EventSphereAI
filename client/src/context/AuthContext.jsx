import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

// Direct HTTP API Base URL (defaults to http://localhost:5000/api)
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('eventsphere_token') || null);
  const [loading, setLoading] = useState(true);

  // Global Auth Modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register'
  const [authModalInitialRole, setAuthModalInitialRole] = useState('Participant');

  // Helper to fetch real authenticated user profile directly from MongoDBAtlas backend
  const fetchUserProfile = async (jwtToken) => {
    try {
      // Primary: GET http://localhost:5000/api/auth/me
      const response = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      return response.data;
    } catch (err) {
      // Fallback alias: GET http://localhost:5000/api/users
      try {
        const fallbackRes = await axios.get(`${API_BASE_URL}/users`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        return fallbackRes.data;
      } catch (fallbackErr) {
        throw err;
      }
    }
  };

  // Initialize and verify profile if stored token exists in localStorage
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('eventsphere_token');
      if (storedToken) {
        try {
          const profile = await fetchUserProfile(storedToken);
          setUser({ ...profile, token: storedToken });
          setToken(storedToken);
          localStorage.setItem('eventsphere_user', JSON.stringify(profile));
        } catch (err) {
          console.warn('Stored JWT token is invalid or expired, clearing session:', err.message);
          localStorage.removeItem('eventsphere_token');
          localStorage.removeItem('eventsphere_user');
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

  // Direct backend Login: POST http://localhost:5000/api/auth/login
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: email.trim(),
        password,
      });

      const { token: receivedToken, ...initialUserData } = response.data;

      // 1. Save returned JWT token and user profile in localStorage
      localStorage.setItem('eventsphere_token', receivedToken);
      localStorage.setItem('eventsphere_user', JSON.stringify(initialUserData));
      setToken(receivedToken);

      // 2. Fetch real user data directly from MongoDBAtlas backend (/api/auth/me or /api/users)
      let verifiedUser = initialUserData;
      try {
        const freshProfile = await fetchUserProfile(receivedToken);
        if (freshProfile) {
          verifiedUser = { ...freshProfile, token: receivedToken };
          localStorage.setItem('eventsphere_user', JSON.stringify(freshProfile));
        }
      } catch (profileErr) {
        console.warn('Could not refresh full profile from /api/auth/me, using auth response data:', profileErr.message);
      }

      setUser(verifiedUser);
      setIsAuthModalOpen(false);
      return { success: true, user: verifiedUser, token: receivedToken };
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

  // Direct backend Signup: POST http://localhost:5000/api/auth/register
  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        name: userData.name?.trim(),
        email: userData.email?.trim(),
        password: userData.password,
        role: userData.role || 'Participant', // Organizer, Participant, Volunteer
        organizerKey: userData.organizerKey,
        volunteerCode: userData.volunteerCode,
      });

      const { token: receivedToken, ...initialUserData } = response.data;

      // 1. Save returned JWT token and user profile in localStorage
      localStorage.setItem('eventsphere_token', receivedToken);
      localStorage.setItem('eventsphere_user', JSON.stringify(initialUserData));
      setToken(receivedToken);

      // 2. Fetch real user data directly from MongoDBAtlas backend (/api/auth/me or /api/users)
      let verifiedUser = initialUserData;
      try {
        const freshProfile = await fetchUserProfile(receivedToken);
        if (freshProfile) {
          verifiedUser = { ...freshProfile, token: receivedToken };
          localStorage.setItem('eventsphere_user', JSON.stringify(freshProfile));
        }
      } catch (profileErr) {
        console.warn('Could not refresh full profile from /api/auth/me, using register response data:', profileErr.message);
      }

      setUser(verifiedUser);
      setIsAuthModalOpen(false);
      return { success: true, user: verifiedUser, token: receivedToken };
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
    localStorage.removeItem('eventsphere_user');
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
        fetchUserProfile,
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

