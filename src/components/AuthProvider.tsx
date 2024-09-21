import { useAuthStore } from '@/stores/useAuthStore';
import { useProfileStore } from '@/stores/useProfileStore';
import { Redirect } from 'expo-router';
import React, { useCallback } from 'react';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { profile, status } = useProfileStore();
  const { signOut } = useAuthStore();

  const handleOnNoProfileFound = useCallback(async () => {
    await signOut();
    return <Redirect href="/" />;
  }, [signOut]);

  if (status === 'pending') {
    return <StateView state="Loading" />;
  }

  if (status === 'error') {
    handleOnNoProfileFound();
  }

  if (!profile) {
  }
  return <>{children}</>;
};

export default AuthProvider;

const StateView = ({ state }: { state: string }) => (
  <SafeAreaView className="flex-1 items-center justify-center bg-primary">
    <Text className="font-pbold text-xl text-primary-foreground">{state}</Text>
  </SafeAreaView>
);
