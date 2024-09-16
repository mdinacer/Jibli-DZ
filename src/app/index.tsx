import AppLink from '@/components/AppLink';
import useLoadProfile from '@/hooks/useLoadProfile';
import { useAuthStore } from '@/stores/useAuthStore';
import { Redirect } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Index = () => {
  const { user } = useAuthStore();

  const { profile, status } = useLoadProfile();

  if (status === 'pending') {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View>
          <Text>{status}</Text>
          <Text>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (user && !profile) {
    return <Redirect href={'/onboarding'} />;
  }

  if (profile) {
    return <Redirect href={'/home'} />;
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View>
        <Text>{user ? `Signed in as ${user.email}` : 'Not signed in'}</Text>
        <Text>Index</Text>

        <View className="w-full flex-row justify-evenly">
          <AppLink href={'/sign-in'}>Sign-In</AppLink>
          <AppLink href={'/sign-up'}>Sign-Up</AppLink>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Index;
