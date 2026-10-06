import { useState, useEffect, useCallback } from "react";
import { authService } from "../services/authService";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize and check current authentication state
  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      if (authService.getToken()) {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (err) {
      setError(err.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Login handler
  const login = async (credentials) => {
    setError(null);
    try {
      const data = await authService.login(credentials);
      setUser(data.user || data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Register handler
  const register = async (userData) => {
    setError(null);
    try {
      const data = await authService.register(userData);
      setUser(data.user || data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Logout handler
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refetchUser: checkAuth,
  };
};

export default useAuth;
