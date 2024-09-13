import ItemsList from '@/components/item/ItemsList';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { YStack } from 'tamagui';

const Index = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack flex={1}>{/* <ProductsGrid /> */}</YStack>
    </SafeAreaView>
  );
};

export default Index;
