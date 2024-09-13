import ListCreateField from '@/components/list/ListCreateField';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Create = () => {
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1 }}>
      <View>
        <ListCreateField
          onComplete={(list) => {
            console.log(JSON.stringify(list, null, 2));
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default Create;
