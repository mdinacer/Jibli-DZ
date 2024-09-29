import { ThemeType } from '@/constants/Colors';
import { useAuthStore } from '@/stores/useAuthStore';
import { useProfileStore } from '@/stores/useProfileStore';
import { Redirect } from 'expo-router';
import React, { useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Text from './Themed/Text';
import { useThemeColor } from '@/hooks/useThemeColor';
import { StyleSheet } from 'react-native';

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

const StateView = ({ state }: { state: string }) => {
  const theme = useThemeColor({}) as ThemeType;
  return (
    <SafeAreaView
      style={[
        styles.safeAreaView,
        {
          backgroundColor: theme.background
        }
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: theme.primaryForeground
          }
        ]}
      >
        {state}
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    lineHeight: 28
  }
});
