import ItemDisplay from '@/components/list/ItemDisplay';
import { useColumnWidth } from '@/hooks/useColumnWidth';
import { ListItem } from '@/models/ListItem';
import { sortItemByStatus } from '@/utils/list-utils';
import { useMemo } from 'react';
import { FlatList, Text } from 'react-native';

const COLS_COUNT = 2;
const ITEMS_SPACING = 4;
const ITEM_PADDING = 16;

interface Props {
  items: ListItem[];
}

const ItemsList: React.FC<Props> = ({ items = [] }) => {
  const { size } = useColumnWidth({
    colsCount: COLS_COUNT,
    itemsSpacing: ITEMS_SPACING,
    itemPadding: ITEM_PADDING
  });

  const sortedItem = useMemo(() => sortItemByStatus(items), [items]);
  return (
    <FlatList<ListItem>
      numColumns={COLS_COUNT}
      columnWrapperStyle={{
        gap: ITEMS_SPACING,
        paddingHorizontal: ITEM_PADDING
      }}
      contentContainerStyle={{ gap: ITEMS_SPACING }}
      data={sortedItem}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ItemDisplay style={{ width: size }} item={item} />
      )}
      ListEmptyComponent={<Text>No items</Text>}
    />
  );
};

export default ItemsList;
