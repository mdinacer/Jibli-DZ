import UserListItem from '@/components/userList/UserListItem';
import { useColumnWidth } from '@/hooks/useColumnWidth';
import { ListItem } from '@/models/ListItem';
import { sortItemByStatus } from '@/utils/list-utils';
import { useMemo } from 'react';
import { FlatList, Text } from 'react-native';

const COLS_COUNT = 1;
const ITEMS_SPACING = 16;
const ITEM_PADDING = 0;

interface Props {
  items: ListItem[];
}

const ItemsList: React.FC<Props> = ({ items = [] }) => {
  const sortedItem = useMemo(() => sortItemByStatus(items), [items]);
  return (
    <FlatList<ListItem>
      //numColumns={COLS_COUNT}
      // columnWrapperStyle={{
      //   gap: ITEMS_SPACING,
      //   paddingHorizontal: ITEM_PADDING
      // }}
      contentContainerStyle={{ rowGap: 16 }}
      data={sortedItem}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <UserListItem item={item} />}
      ListEmptyComponent={<Text>No items</Text>}
    />
  );
};

export default ItemsList;
