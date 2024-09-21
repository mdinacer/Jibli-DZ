import { useListStore } from '@/stores/useListStore';
import React, { useMemo } from 'react';
import { Dimensions, FlatList, FlatListProps, Text, View } from 'react-native';
import SharedListDisplay from '@/components/sharedList/SharedListDisplay';
import { List } from '@/models/List';
import EmptyState from '../EmptyState';
import { useTranslation } from 'react-i18next';

interface Props extends Partial<FlatListProps<List>> {}

const PADDING = 0;

const SharedLists: React.FC<Props> = ({ ...props }) => {
  const { t } = useTranslation('common');
  const lists = useListStore((state) => state.lists.filter((l) => !l.isOwner));
  const { width } = Dimensions.get('window');

  const size = useMemo(
    () =>
      lists.length > 0 ? (width - PADDING * 2) * 0.9 : width - PADDING * 2,
    [lists.length, width]
  );

  return (
    <>
      <Text className="mt-5 font-pregular text-base text-muted-foreground">
        {t('shared_list_many')}
      </Text>
      <FlatList
        className="flex-1 pb-4"
        contentContainerStyle={{
          columnGap: 16,
          paddingBottom: 16
          //padding: 16
        }}
        data={lists}
        keyExtractor={(l) => l.id}
        renderItem={({ item }) => (
          <SharedListDisplay width={size} list={item} />
        )}
        ListEmptyComponent={
          <View style={{ width: width - 16 * 2 }}>
            <EmptyState
              title={t('title', {
                keyPrefix: 'shared_list_empty_state'
              })}
              description={t('description', {
                keyPrefix: 'shared_list_empty_state'
              })}
            />
          </View>
        }
        {...props}
      />
    </>
  );
};

export default SharedLists;
