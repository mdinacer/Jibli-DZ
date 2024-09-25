import AppLink from '@/components/AppLink';
import { Images } from '@/constants';
import { useAuthStore } from '@/stores/useAuthStore';
import { Redirect } from 'expo-router';
import React from 'react';
import { ImageBackground, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const Index = () => {
  const { user } = useAuthStore();

  if (user) {
    return <Redirect href={'/home'} />;
  }
  return (
    <ImageBackground className="flex-1 object-cover" source={Images.hero}>
      <SafeAreaView style={{ flex: 1 }}>
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
      </SafeAreaView>
      <StatusBar style="light" />
    </ImageBackground>
  );
};

export default Index;
