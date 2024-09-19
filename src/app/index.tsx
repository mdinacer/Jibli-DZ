import AppLink from '@/components/AppLink';
import { Images } from '@/constants';
import { useAuthStore } from '@/stores/useAuthStore';
import { Redirect } from 'expo-router';
import React from 'react';
import { ImageBackground, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const image = {
  uri: 'https://docs.expo.dev/static/images/tutorial/background-image.png'
};

const Index = () => {
  const { user } = useAuthStore();

  if (user) {
    return <Redirect href={'/home'} />;
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground className="flex-1 object-cover" source={Images.hero}>
        <View className="flex-1 items-center justify-center">
          <View className="w-full flex-row justify-evenly">
            <AppLink
              className="font-pbold text-xl capitalize text-white"
              href={'/sign-in'}
            >
              Sign In
            </AppLink>
            <AppLink
              className="font-pbold text-xl capitalize text-white"
              href={'/sign-up'}
            >
              Sign Up
            </AppLink>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Index;
