import { List } from '@/models/List';
import listsService from '@/services/ListService';
import { useListStore } from '@/stores/useListStore';
import { useUserListStore } from '@/stores/useUserListStore';
import { sortItemByStatus } from '@/utils/list-utils';
import { useCallback, useEffect } from 'react';

export default function useLoadLists() {
  const { loading, loaded, lists, setLoadingStatus, setError, setLists } =
    useListStore();
  const { list: formList, setList: setFormList } = useUserListStore();

  const fetchLists = useCallback(async () => {
    setLoadingStatus(true, false);
    try {
      const data: List[] = await listsService.list();
      if (!data || !data.length) {
        return [];
      }

      const userList = data.find((list) => list.isOwner);

      if (!formList && userList) {
        setFormList({ ...userList, items: sortItemByStatus(userList.items) });
      }
      setLists(data);
    } catch (error: any) {
      setError(error.message);
      console.error(error);
    } finally {
      setLoadingStatus(false, true);
    }
  }, [formList, setError, setFormList, setLists, setLoadingStatus]);

  const handleLoadLists = useCallback(async () => {
    await fetchLists();
  }, [fetchLists]);

  useEffect(() => {
    if (!loaded && !loading) {
      handleLoadLists();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, loading]);

  return {
    handleLoadLists,
    fetchLists,
    lists,
    loading
  };
}
