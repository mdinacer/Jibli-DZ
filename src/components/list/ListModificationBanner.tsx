import useUserListChangesTracker from '@/hooks/useUserListChangesTracker';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Text from '@/components/Themed/Text';
import Link from '@/components/Themed/Link';

const ListModificationBanner = () => {
  const { list, listModified } = useUserListChangesTracker();

  if (!list || !listModified) return null;
  return (
    <SafeAreaView
      edges={['bottom']}
      style={{
        borderTopColor: '#FFC470',
        borderTopWidth: 1,
        backgroundColor: '#FFC470'
      }}
    >
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingVertical: 8
        }}
      >
        <Text>You have unsaved changes</Text>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            columnGap: 12
          }}
        >
          <Link href={`/list/${list.id}`}>View changes</Link>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ListModificationBanner;
