import useUserListChangesTracker from '@/hooks/useUserListChangesTracker';
import ListsService from '@/services/ListService';
import { useListStore } from '@/stores/useListStore';
import { useUserListStore } from '@/stores/useUserListStore';
import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';

export default function useUserListEdit() {
  const [modals, setModals] = useState({
    form: false,
    collaborators: false
  });
  const [state, setState] = useState({
    loading: false,
    saving: false
  });
  const { lists, updateList: updateOriginalList } = useListStore();
  const originalList = useMemo(() => lists.find((l) => l.isOwner), [lists]);

  const { list, removeItem, setModified, setList } = useUserListStore();

  const { listModified: modified, collaboratorsChanged } =
    useUserListChangesTracker();

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
    } catch (error) {
      console.error(error);
    } finally {
      setState({ ...state, saving: false });
    }
  }, [collaboratorsChanged, list, setModified, state, updateOriginalList]);

  const discardChanges = useCallback(() => {
    if (!originalList) return;
    if (modified) {
      setList(originalList);
      setModified(false);
    } else {
      router.back();
    }
  }, [modified, originalList, setList, setModified]);

  const toggleItemFormModal = (value: boolean) => {
    setModals({ collaborators: false, form: value });
  };

  const toggleCollaboratorsModal = (value: boolean) => {
    setModals({ form: false, collaborators: value });
  };

  return {
    list,
    modals,
    modified,
    state,
    discardChanges,
    removeItem,
    saveChanges,
    toggleCollaboratorsModal,
    toggleItemFormModal
  };
}
