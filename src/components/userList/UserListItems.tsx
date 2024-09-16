import UserListItem from '@/components/userList/UserListItem';
import { ListItem } from '@/models/ListItem';
import { sortItemByStatus } from '@/utils/list-utils';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Text } from 'react-native';

interface Props {
  items: ListItem[];
}

const ItemsList: React.FC<Props> = ({ items = [] }) => {
  const { t } = useTranslation('common');
  const sortedItem = useMemo(() => sortItemByStatus(items), [items]);
  return (
    <FlatList<ListItem>
      contentContainerStyle={{ rowGap: 16 }}
      data={sortedItem}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <UserListItem item={item} />}
      ListEmptyComponent={<Text>{t('item_zero', { count: 0 })}</Text>}
    />
  );
};

export default ItemsList;
