import useUserListChangesTracker from '@/hooks/useUserListChangesTracker';
import { Link } from '@react-navigation/native';
import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ListModificationBanner = () => {
  const { list, listModified } = useUserListChangesTracker();

  if (!list || !listModified) return null;
  return (
    <SafeAreaView
      edges={['bottom']}
      className="border-t border-t-[#FFC470] bg-[#FFC470]"
    >
      <View className="w-full flex-row items-center justify-between px-4 py-2">
        <Text className="font-pregular text-base">
          You have unsaved changes
        </Text>

        <View className="flex-row items-center space-x-3">
          <Link to={`/list/${list.id}`}>View changes</Link>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ListModificationBanner;
