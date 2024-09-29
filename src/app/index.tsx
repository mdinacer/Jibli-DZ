import Link from '@/components/Themed/Link';
import { Images } from '@/constants';
import { useAuthStore } from '@/stores/useAuthStore';
import { Redirect } from 'expo-router';
import React from 'react';
import { ImageBackground, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Index = () => {
  const { user } = useAuthStore();

  if (user) {
    return <Redirect href={'/home'} />;
  }
  return (
    <ImageBackground
      resizeMode="cover"
      style={{ flex: 1 }}
      source={Images.hero3}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-evenly'
            }}
          >
            <Link href={'/sign-in'}>Sign In</Link>
            <Link href={'/sign-up'}>Sign Up</Link>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Index;
