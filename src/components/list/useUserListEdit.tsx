import useUserListChangesTracker from '@/hooks/useUserListChangesTracker';
import ListsService from '@/services/ListService';
import PushNotificationsService from '@/services/PushNotificationsService';
import { useListStore } from '@/stores/useListStore';
import { useUserListStore } from '@/stores/useUserListStore';
import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';

export default function useUserListEdit() {
  const [state, setState] = useState({
    loading: false,
    saving: false
  });
  const { lists, updateList: updateOriginalList } = useListStore();
  const originalList = useMemo(() => lists.find((l) => l.isOwner), [lists]);

  const { list, removeItem, setModified, setList } = useUserListStore();

  const {
    listModified: modified,
    collaboratorsChanged,
    itemsChanged
  } = useUserListChangesTracker();

  const saveChanges = useCallback(async () => {
    if (!list) return;
    setState({ ...state, saving: true });
    try {
      await ListsService.update(list.id, list);
      updateOriginalList(list.id, list);
      if (collaboratorsChanged) {
        await ListsService.updateCollaborators(list.id, list.collaborators);
      }
      setModified(false);
      if (list.collaborators.length > 0 && itemsChanged) {
        PushNotificationsService.multicast({
          userIds: list.collaborators,
          title: 'List updated',
          body: ` ${list.name} has been updated`
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setState({ ...state, saving: false });
    }
  }, [
    collaboratorsChanged,
    itemsChanged,
    list,
    setModified,
    state,
    updateOriginalList
  ]);

  const discardChanges = useCallback(() => {
    if (!originalList) return;
    if (modified) {
      setList(originalList);
      setModified(false);
    } else {
      router.back();
    }
  }, [modified, originalList, setList, setModified]);

  return {
    itemsChanged,
    list,

    modified,
    state,
    discardChanges,
    removeItem,
    saveChanges
  };
}
