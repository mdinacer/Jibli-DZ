import useLoadProfile from '@/hooks/useLoadProfile';
import { useAuthStore } from '@/stores/useAuthStore';
import { Link, Redirect } from 'expo-router';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, XStack, YStack } from 'tamagui';

const Index = () => {
  const { user } = useAuthStore();
  const { profile, status } = useLoadProfile();

  if (status === 'pending') {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <YStack padding="$6">
          <Text>{status}</Text>
          <Text>Loading profile...</Text>
        </YStack>
      </SafeAreaView>
    );
  }

  if (user && !profile) {
    console.log(user);
    return <Redirect href={'/onboarding'} />;
  }

  if (profile) {
    return <Redirect href={'/home'} />;
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack padding="$6">
        <Text width={'100%'} color={'green'}>
          {user ? `Signed in as ${user.email}` : 'Not signed in'}
        </Text>
        <Text>Index</Text>

        <XStack width={'100%'} justifyContent={'center'} gap={'$8'}>
          <Link href={'/sign-in'}>Sign-In</Link>
          <Link href={'/sign-up'}>Sign-Up</Link>
        </XStack>
      </YStack>
    </SafeAreaView>
  );
};

export default Index;
