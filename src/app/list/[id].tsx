import UserListEdit from '@/components/list/UserListEdit';
import useLoadLists from '@/hooks/useLoadLists';
import { useListStore } from '@/stores/useListStore';
import { useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const List = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { lists } = useLoadLists();

  const list = useMemo(() => lists.find((l) => l.id === id), [id, lists]);

  if (!list) {
    return (
      <View>
        <Text>List not found</Text>
      </View>
    );
  }
  return (
    <SafeAreaView
      className="relative"
      edges={['top', 'left', 'right', 'bottom']}
    >
      {list.isOwner ? <UserListEdit /> : <Text>Shared list edit</Text>}
    </SafeAreaView>
  );
};

export default List;
