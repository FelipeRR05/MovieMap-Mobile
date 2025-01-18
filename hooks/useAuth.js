import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = await AsyncStorage.getItem('authToken');
      setIsAuthenticated(!!token);
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (token) => {
    await AsyncStorage.setItem('authToken', token);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('authToken');
    setIsAuthenticated(false);
  };

  return { isAuthenticated, loading, login, logout };
}
