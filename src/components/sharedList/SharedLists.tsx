import { useListStore } from '@/stores/useListStore';
import React, { useMemo } from 'react';
import { Dimensions, FlatList, FlatListProps, Text, View } from 'react-native';
import SharedListDisplay from '@/components/sharedList/SharedListDisplay';
import { List } from '@/models/List';
import EmptyState from '../EmptyState';

interface Props extends Partial<FlatListProps<List>> {}

const PADDING = 16;

const SharedLists: React.FC<Props> = ({ ...props }) => {
  const lists = useListStore((state) => state.lists.filter((l) => !l.isOwner));
  const { width } = Dimensions.get('window');

  const size = useMemo(
    () =>
      lists.length > 0 ? width - PADDING * 2 : (width - PADDING * 2) * 0.8,
    [lists.length, width]
  );

  return (
    <>
      <Text className="mt-5 font-pregular text-base text-muted-foreground">
        Shared Lists
      </Text>
      <FlatList
        style={{ flex: 1, width: '100%' }}
        contentContainerStyle={{ rowGap: 8 }}
        data={lists}
        keyExtractor={(l) => l.id}
        renderItem={({ item }) => (
          <SharedListDisplay width={size} list={item} />
        )}
        ListEmptyComponent={
          <View style={{ width: width - PADDING * 2 }}>
            <EmptyState
              title="No shared lists"
              description="You don’t have any shared lists yet. When others share a list with you, it will appear here."
            />
          </View>
        }
        {...props}
      />
    </>
  );
};

export default SharedLists;
