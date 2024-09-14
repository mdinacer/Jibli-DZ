import ListsService from '@/services/ListService';
import { useUserListStore } from '@/stores/useUserListStore';
import { useCallback, useEffect } from 'react';

export function useLoadUserList() {
  const userListStore = useUserListStore();
  const { list, setList, state, loaded, setState, setLoaded } = userListStore;

  const handleLoadUserList = useCallback(async () => {
    setState('pending');
    setLoaded(false);
    try {
      const userLists = await ListsService.getUserLists();

      if (userLists.length > 0) {
        const [userList] = userLists;
        setList(userList);
        setState('success');
      } else {
        setState('no_data');
      }
    } catch (error) {
      console.error(error);
      setState('error');
    } finally {
      setLoaded(true);
    }
  }, [setList, setState, setLoaded]);

  useEffect(() => {
    if (!loaded && state === 'idle') {
      handleLoadUserList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, state, handleLoadUserList]);

  return {
    ...userListStore,
    handleLoadUserList
  };
}
