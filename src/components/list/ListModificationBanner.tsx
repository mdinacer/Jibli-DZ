import useUserListChangesTracker from '@/hooks/useUserListChangesTracker';
import { Link } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
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
          <TouchableOpacity>
            <Text className="font-pregular text-base">Save</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text className="font-pregular text-base">Discard</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ListModificationBanner;
