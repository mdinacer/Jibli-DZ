import { Collections } from '@/config/collections';
import firebaseServices from '@/config/firebaseConfig';
import { RealtimeList } from '@/models/List';
import listsService from '@/services/ListService';
import { useListStore } from '@/stores/useListStore';
import CustomError from '@/utils/CustomError';
import { useCallback, useEffect } from 'react';

function useListCollaboratorsListener() {
  const { lists, loaded: listsLoaded, addList, removeList } = useListStore();

  const handleCollaboratorsChange = useCallback(
    async (
      userId: string,
      list: RealtimeList,
      action: 'child_added' | 'update' | 'child_removed'
    ) => {
      const storeList = lists.find((l) => l.id === list.listId);

      if (storeList?.isOwner) return;

      if (storeList) {
        if (
          action === 'child_removed' ||
          !list.collaborators.includes(userId)
        ) {
          removeList(storeList.id);

          // Toast.show({
          //   type: 'error',
          //   text1: 'Collaboration Revoked',
          //   text2: `Your participation to the list "${storeList.name}" has been revoked`
          // });
          return;
        }
      } else if (list.collaborators.includes(userId)) {
        // Handle addition of new list collaboration
        const fetchedList = await listsService.get(list.listId);
        if (fetchedList) {
          addList(fetchedList);
          // Toast.show({
          //   type: 'info',
          //   text1: 'New shared list',
          //   text2: `A new list "${fetchedList.name}" has been shared with you`
          // });
        }
      }
    },
    [addList, lists, removeList]
  );

  const initCollaboratorsListener = useCallback(
    (userId: string) => {
      if (!listsLoaded) return;
      const realtimeDatabaseRef = firebaseServices.database.ref(
        Collections.LISTS
      );

      const addedListsListener = realtimeDatabaseRef.on(
        'child_added',
        async (snapshot) => {
          handleCollaboratorsChange(
            userId,
            snapshot.val() as RealtimeList,
            'child_added'
          );
        }
      );

      const updatedListsListener = realtimeDatabaseRef.on(
        'child_changed',
        async (snapshot) => {
          handleCollaboratorsChange(
            userId,
            snapshot.val() as RealtimeList,
            'update'
          );
        }
      );

      const deletedListsListener = realtimeDatabaseRef.on(
        'child_removed',
        async (snapshot) => {
          handleCollaboratorsChange(
            userId,
            snapshot.val() as RealtimeList,
            'child_removed'
          );
        }
      );

      return () => {
        realtimeDatabaseRef.off('child_added', addedListsListener);
        realtimeDatabaseRef.off('child_changed', updatedListsListener);
        realtimeDatabaseRef.off('child_removed', deletedListsListener);
      };
    },
    [handleCollaboratorsChange, listsLoaded]
  );

  useEffect(() => {
    const user = firebaseServices.auth.currentUser;
    if (!user) {
      throw new CustomError('User not logged in', 'USER_NOT_LOGGED_IN');
    }
    if (!listsLoaded) return;

    const cleanupListeners = initCollaboratorsListener(user.uid);

    return () => {
      if (cleanupListeners) {
        cleanupListeners();
      }
    };
  }, [initCollaboratorsListener, listsLoaded]);

  return null;
}

export default useListCollaboratorsListener;
