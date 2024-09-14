import ItemsList from '@/components/item/ItemsList';
import ProductsGrid from '@/components/product/ProductsGrid';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Index = () => {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
      <View className="flex-1">
        <ProductsGrid />
        <ItemsList />
      </View>
    </SafeAreaView>
  );
};

export default Index;
