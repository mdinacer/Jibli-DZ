import { useAuthStore } from '@/stores/useAuthStore';
import { Link } from 'expo-router';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, XStack, YStack } from 'tamagui';

const Index = () => {
  const { user } = useAuthStore();
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
