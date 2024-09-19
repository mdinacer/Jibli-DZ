import useLoadUserProfile from '@/hooks/useLoadUserProfile';
import { Redirect } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { profile, status } = useLoadUserProfile();

  if (status === 'pending') {
    return <StateView state="Loading" />;
  }

  if (status === 'error') {
    return <StateView state="Error" />;
  }

  if (!profile) {
    return <Redirect href="/" />;
  }
  return <>{children}</>;
};

export default AuthProvider;

const StateView = ({ state }: { state: string }) => (
  <SafeAreaView className="flex-1 items-center justify-center bg-primary">
    <Text className="font-pbold text-xl text-primary-foreground">{state}</Text>
  </SafeAreaView>
);
