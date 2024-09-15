import ListDisplay from '@/components/list/ListDisplay';
import { useLoadUserList } from '@/hooks/useLoadUserList';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Index = () => {
  const { list, state } = useLoadUserList();

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
      <View className="flex-1 px-4" style={{ gap: 16 }}>
        {list && <ListDisplay list={list} />}
        {/* <ProductsGrid />
        <ItemsList /> */}
      </View>
    </SafeAreaView>
  );
};

export default Index;
