import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, userAPI } from '../api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          const userData = await authAPI.getProfile(token);
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error fetching user profile:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      const newToken = response.access_token;
      
      localStorage.setItem('authToken', newToken);
      setToken(newToken);
      
      const userData = await authAPI.getProfile(newToken);
      setUser(userData);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Error de login' 
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      await authAPI.register({ name, email, password });
      // After registration, automatically login
      return await login(email, password);
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Error de registro' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const getUserStats = async () => {
    if (!token) return null;
    try {
      return await userAPI.getStats(token);
    } catch (error) {
      console.error('Error fetching user stats:', error);
      return null;
    }
  };

  const getUserProgress = async () => {
    if (!token) return null;
    try {
      return await userAPI.getProgress(token);
    } catch (error) {
      console.error('Error fetching user progress:', error);
      return null;
    }
  };

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    getUserStats,
    getUserProgress
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};