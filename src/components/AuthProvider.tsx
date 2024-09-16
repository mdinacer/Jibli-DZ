import { useAuthStore } from '@/stores/useAuthStore';
import { useProfileStore } from '@/stores/useProfileStore';
import { Redirect } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';

const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { user } = useAuthStore();
  const { profile, status } = useProfileStore();

  if (status === 'pending') {
    return <Text>Loading...</Text>;
  }

  if (status === 'error') {
    return <Text>Error</Text>;
  }

  if (!user || !profile) {
    return <Redirect href="/" />;
  }
  return <>{children}</>;
};

export default AuthProvider;
