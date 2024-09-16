import { PendingItemsReducerPropsType } from '@/components/pendingItems/pendingItemsReducer';
import { Icons } from '@/constants';
import { ListItemStatus } from '@/models/ListItem';
import listsService from '@/services/ListService';
import { useListStore } from '@/stores/useListStore';
import React, { useCallback, useMemo, useState } from 'react';
import { Alert, Text, View } from 'react-native';
import IconButton from '../IconButton';

interface Props extends PendingItemsReducerPropsType {
  listId: string;
  listName: string;
}
const SectionHeader: React.FC<Props> = ({
  state,
  dispatch,
  listId,
  listName
}) => {
  const { lists, updateList } = useListStore();
  const [saving, setSaving] = useState(false);
  const isModified = useMemo(() => {
    const list = state.lists.find((l) => l.id === listId);
    if (!list) return false;
    return list.items.some((i) => i.status !== ListItemStatus.PENDING);
  }, [listId, state.lists]);

  const handleRestoreList = useCallback(() => {
    dispatch({ action: 'RESTORE_LIST', payload: { listId } });
  }, [dispatch, listId]);

  const handleSaveChanges = useCallback(async () => {
    setSaving(true);
    try {
      const originalList = lists.find((l) => l.id === listId);
      const modifiedList = state.lists.find((l) => l.id === listId);
      if (!originalList || !modifiedList) return;
      const updatedItems = originalList.items.map((originalItem) => {
        const modifiedItem = modifiedList.items.find(
          (item) => item.id === originalItem.id
        );

        if (!modifiedItem || modifiedItem.status === ListItemStatus.PENDING) {
          return originalItem;
        }
        return {
          ...originalItem,
          status: modifiedItem.status
        };
      });
      await listsService.update(listId, {
        items: updatedItems
      });
      updateList(listId, {
        items: updatedItems
      });
      // loadFilteredLists();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setSaving(false);
    }
  }, [listId, lists, state.lists, updateList]);

  return (
    <View className={`flex-row items-center justify-between`}>
      <Text
        className={`font-pregular text-base ${isModified ? 'text-primary' : 'text-muted-foreground'}`}
      >
        {listName}
      </Text>
      <View className="flex-row space-x-4">
        <IconButton
          size="sm"
          variant="bordered"
          icon={Icons.CheckIcon}
          onPress={handleSaveChanges}
          disabled={!isModified || saving}
        />
        <IconButton
          variant="secondary"
          size="sm"
          icon={Icons.CancelIcon}
          disabled={!isModified || saving}
          onPress={handleRestoreList}
        />
      </View>
    </View>
  );
};

export default React.memo(SectionHeader);
