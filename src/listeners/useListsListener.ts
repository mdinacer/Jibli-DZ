import { Collections } from '@/config/collections';
import firebaseServices from '@/config/firebaseConfig';
import { List } from '@/models/List';
import { useUserListStore } from '@/stores/useUserListStore';
import { useListStore } from '@/stores/useListStore';
import {
  FirebaseFirestoreTypes,
  or,
  query,
  where
} from '@react-native-firebase/firestore'; // Import from react-native-firebase
import { useCallback, useEffect, useState } from 'react';

function useListsListener() {
  const { list: formList, setList } = useUserListStore();

  const [status, setStatus] = useState<{
    loading: boolean;
    error: string | null;
  }>({
    loading: true,
    error: null
  });

  const { lists, loaded, updateList, addList, removeList } = useListStore();

  const handleDocChanges = useCallback(
    (change: FirebaseFirestoreTypes.DocumentChange<List>, userId: string) => {
      const { type, doc } = change;

      if (type === 'added') return;

      const list = {
        ...doc.data(),
        id: doc.id,
        isOwner: doc.data().ownerId === userId
      } as List;

      const localChanges = list.modifiedBy === userId;

      // Local modification should be ignored from listener
      if (localChanges) return;

      // handle changes done by the owner (list details and items changes)

      if (list.modifiedBy === list.ownerId) {
        const storeList = lists.find((l) => l.id === list.id);
        if (type === 'modified' && storeList) {
          updateList(list.id, list); // existent list updated
        }

        if (type === 'removed' && storeList) {
          removeList(storeList.id); // shared list removed by owner
        }
      }

      // handle changes done by a collaborator
      if (
        list.isOwner &&
        list.modifiedBy &&
        list.collaborators.includes(list.modifiedBy)
      ) {
        if (type === 'modified' && formList) {
          const updatedItems = formList.items.map((item, index) => {
            const newItem = list.items.find((l) => l.id === item.id);
            return newItem ? { ...item, status: newItem.status } : item;
          });

          const updatedList: List = {
            ...formList,
            modifiedBy: list.modifiedBy,
            updatedAt: list.updatedAt,
            items: updatedItems
          };

          updateList(list.id, updatedList); // Update the list in the store
          setList(updatedList); // Update the list in the form
        }
      }
    },
    [formList, lists, removeList, setList, updateList]
  );

  const handleInitListener = useCallback(
    (userId: string) => {
      const listsRef = firebaseServices.firestore.collection(
        Collections.LISTS
      ) as FirebaseFirestoreTypes.CollectionReference<List>;

      const userListsQuery = query(
        listsRef,
        or(
          where('ownerId', '==', userId),
          where('collaborators', 'array-contains', userId)
        )
      );

      return userListsQuery.onSnapshot(
        (querySnapshot) => {
          querySnapshot
            .docChanges()
            .forEach((change) => handleDocChanges(change, userId));

          setStatus({ loading: false, error: null });
          const source = querySnapshot.metadata.fromCache
            ? 'local cache'
            : 'server';
          console.log('Data came from ' + source);
        },
        (error: any) => {
          console.error('Error listening to lists:', error);
          setStatus({ loading: false, error: error.message });
        }
      );
    },
    [handleDocChanges]
  );

  useEffect(() => {
    const user = firebaseServices.auth.currentUser;

    if (!user) {
      setStatus({ loading: false, error: 'User not found' });
      return;
    }
    if (!loaded) {
      setStatus({
        loading: false,
        error: 'Lists not loaded'
      });
      return;
    }

    const unsubscribe = handleInitListener(user.uid);

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [handleInitListener, loaded]);

  return { status };
}

export default useListsListener;
