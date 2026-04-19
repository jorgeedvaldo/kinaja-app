import React from 'react';
import { useAuth } from '../context/AuthContext';
import AuthStack from './AuthStack';
import MainTabs from './MainTabs';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner message="Carregando..." />;
  }

  return isAuthenticated ? <MainTabs /> : <AuthStack />;
}
