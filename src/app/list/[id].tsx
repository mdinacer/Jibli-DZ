import UserListEdit from '@/components/list/UserListEdit';
import SharedListEdit from '@/components/sharedList/SharedListEdit';
import Link from '@/components/Themed/Link';
import SafeAreaView from '@/components/Themed/SafeAreaView';
import useLoadLists from '@/hooks/useLoadLists';
import { useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import { Text, View } from 'react-native';

const List = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { lists } = useLoadLists();

  const list = useMemo(() => lists.find((l) => l.id === id), [id, lists]);

  return (
    <SafeAreaView

    //edges={['top', 'left', 'right', 'bottom']}
    >
      {!list ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            rowGap: 8
          }}
        >
          <Text>List not found</Text>
          <Link href={'/home'}>Go back</Link>
        </View>
      ) : list.isOwner ? (
        <UserListEdit />
      ) : (
        <SharedListEdit listData={list} />
      )}
    </SafeAreaView>
  );
};

export default List;
