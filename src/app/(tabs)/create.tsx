import ListCreateField from '@/components/list/ListCreateField';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { YStack } from 'tamagui';

const Create = () => {
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1 }}>
      <YStack
        padding="$6"
        gap="$4"
        flex={1}
        alignItems="center"
        justifyContent="center"
      >
        <ListCreateField
          onComplete={(list) => {
            console.log(JSON.stringify(list, null, 2));
          }}
        />
      </YStack>
    </SafeAreaView>
  );
};

export default Create;
