import { useListStore } from '@/stores/useListStore';
import { useUserListStore } from '@/stores/useUserListStore';
import { useEffect, useMemo } from 'react';

export default function useUserListChangesTracker() {
  const { lists } = useListStore();
  const originalList = useMemo(() => lists.find((l) => l.isOwner), [lists]);
  const { list, setModified } = useUserListStore();

  const nameChanged = useMemo(() => {
    if (!originalList || !list) return false;
    return originalList.name !== list.name;
  }, [list, originalList]);

  const itemsChanged = useMemo(() => {
    if (!originalList || !list) return false;
    const { items: originalItems } = originalList;
    const { items } = list;

    return JSON.stringify(originalItems) !== JSON.stringify(items);
  }, [list, originalList]);

  const collaboratorsChanged = useMemo(() => {
    if (!originalList || !list) return false;
    const { collaborators: originalCollaborators } = originalList;
    const { collaborators } = list;

    return (
      JSON.stringify(originalCollaborators) !== JSON.stringify(collaborators)
    );
  }, [list, originalList]);

  const listModified = useMemo(() => {
    if (!originalList || !list) return false;
    return nameChanged || itemsChanged || collaboratorsChanged;
  }, [collaboratorsChanged, itemsChanged, list, nameChanged, originalList]);

  useEffect(() => {
    setModified(listModified);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listModified]);

  return {
    nameChanged,
    itemsChanged,
    collaboratorsChanged,
    listModified,
    list
  };
}
