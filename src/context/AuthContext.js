import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState(false);

  // Load stored auth on app start
  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const [storedToken, storedUser, hasLaunched] = await Promise.all([
        AsyncStorage.getItem('@kinaja_token'),
        AsyncStorage.getItem('@kinaja_user'),
        AsyncStorage.getItem('@kinaja_has_launched'),
      ]);

      if (!hasLaunched) {
        setIsFirstLaunch(true);
      }

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.warn('Error loading stored auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (phone, password) => {
    const response = await authService.login(phone, password);
    const { user: userData, token: authToken } = response;

    await AsyncStorage.setItem('@kinaja_token', authToken);
    await AsyncStorage.setItem('@kinaja_user', JSON.stringify(userData));

    setToken(authToken);
    setUser(userData);

    return userData;
  };

  const register = async (data) => {
    const response = await authService.register(data);
    const { user: userData, token: authToken } = response;

    await AsyncStorage.setItem('@kinaja_token', authToken);
    await AsyncStorage.setItem('@kinaja_user', JSON.stringify(userData));

    setToken(authToken);
    setUser(userData);

    return userData;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      // Even if logout API fails, clear local state
      console.warn('Logout API error:', error);
    }

    await AsyncStorage.multiRemove(['@kinaja_token', '@kinaja_user']);
    setToken(null);
    setUser(null);
  };

  const completeOnboarding = async () => {
    await AsyncStorage.setItem('@kinaja_has_launched', 'true');
    setIsFirstLaunch(false);
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token,
    isFirstLaunch,
    login,
    register,
    logout,
    completeOnboarding,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
