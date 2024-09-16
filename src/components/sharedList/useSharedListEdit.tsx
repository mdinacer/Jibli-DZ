import { SharedListReducer } from '@/components/sharedList/sharedListReducer';
import { List } from '@/models/List';
import { ListItemStatus } from '@/models/ListItem';
import ListsService from '@/services/ListService';
import { useListStore } from '@/stores/useListStore';
import { router } from 'expo-router';
import { useCallback, useMemo, useReducer, useState } from 'react';

export default function useSharedListEdit(listData: List) {
  const [state, dispatch] = useReducer(SharedListReducer, {
    list: listData
  });

  const { list } = state;
  const [isSaving, setIsSaving] = useState(false);
  const { updateList } = useListStore();

  const listStatuses = useMemo(
    () => list.items.map((item) => item.status),
    [list.items]
  );
  const originalStatuses = useMemo(
    () => listData.items.map((item) => item.status),
    [listData.items]
  );

  const isModified = useMemo(
    () => JSON.stringify(listStatuses) !== JSON.stringify(originalStatuses),
    [listStatuses, originalStatuses]
  );

  const saveChanges = useCallback(async () => {
    if (!list) return;
    setIsSaving(true);
    try {
      await ListsService.update(list.id, { items: list.items });
      updateList(list.id, list);
      // TODO: Send notification to owner
      // TODO: Show success message
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  }, [list, updateList]);

  const handleItemStatusChange = useCallback(
    (itemId: string, status: ListItemStatus) => {
      dispatch({ action: 'UPDATE_ITEM_STATUS', payload: { itemId, status } });
    },
    []
  );

  const discardChanges = useCallback(() => {
    if (isModified) {
      dispatch({ action: 'SET_LIST', payload: { list: listData } });
    } else {
      router.back();
    }
  }, [isModified, listData]);

  return {
    list,
    state,
    isModified,
    dispatch,
    discardChanges,
    saveChanges,
    handleItemStatusChange
  };
}
