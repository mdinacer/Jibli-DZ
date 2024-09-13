import { Collections } from '@/config/collections';
import firebaseServices from '@/config/firebaseConfig';
import { List, ListCreateInput, RealtimeList } from '@/models/List';
import { Timestamp } from '@react-native-firebase/firestore';

// Import CustomError class
import CustomError from '@/utils/CustomError';

// Helper function to get the current authenticated user
const getCurrentUser = () => {
  const user = firebaseServices.auth.currentUser;
  if (!user) {
    throw new CustomError('User not found', 'USER_NOT_FOUND');
  }
  return user;
};

// Get lists for the current user
const getLists = async (): Promise<List[]> => {
  try {
    const user = getCurrentUser();

    const listsRef = firebaseServices.firestore.collection(Collections.LISTS);

    // Query for lists where the user is the owner
    const ownerQuery = listsRef.where('ownerId', '==', user.uid);
    const ownerQuerySnapshot = await ownerQuery.get();

    // Query for lists where the user is a collaborator
    const collaboratorQuery = listsRef.where(
      'collaborators',
      'array-contains',
      user.uid
    );
    const collaboratorQuerySnapshot = await collaboratorQuery.get();

    // Combine the results
    const combinedDocs = new Map<string, List>();

    // Add owner lists
    ownerQuerySnapshot.forEach((doc) => {
      combinedDocs.set(doc.id, {
        id: doc.id,
        ...doc.data(),
        isOwner: true
      } as List);
    });

    // Add collaborator lists, avoiding duplicates
    collaboratorQuerySnapshot.forEach((doc) => {
      if (!combinedDocs.has(doc.id)) {
        combinedDocs.set(doc.id, {
          id: doc.id,
          ...doc.data(),
          isOwner: false
        } as List);
      }
    });

    // Convert the combined results to an array
    return Array.from(combinedDocs.values());
  } catch (error: any) {
    if (error instanceof CustomError) {
      error.logToCrashlytics();
    } else {
      firebaseServices.crashlytics.recordError(error);
    }
    throw new CustomError('Failed to fetch lists', 'FETCH_LISTS_FAILED');
  }
};

// Get a specific list by its ID
const getListById = async (listId: string): Promise<List | undefined> => {
  try {
    const user = getCurrentUser();
    const listDocRef = firebaseServices.firestore
      .collection(Collections.LISTS)
      .doc(listId);

    const listDoc = await listDocRef.get();

    if (
      !listDoc.exists ||
      (listDoc.data()?.ownerId !== user.uid &&
        !listDoc.data()?.collaborators.includes(user.uid))
    ) {
      firebaseServices.crashlytics.log(
        `List not found or access denied: ${listId}`
      );
      return undefined;
    }

    const listData = listDoc.data() as Omit<List, 'id' | 'isOwner'>;
    return {
      ...listData,
      isOwner: user.uid === listData.ownerId,
      id: listDoc.id
    } as List;
  } catch (error: any) {
    if (error instanceof CustomError) {
      error.logToCrashlytics();
    } else {
      firebaseServices.crashlytics.recordError(error);
    }
    throw new CustomError(
      'Failed to fetch list by ID',
      'FETCH_LIST_BY_ID_FAILED'
    );
  }
};

// Create a new list
const createList = async (data: ListCreateInput): Promise<List | undefined> => {
  try {
    const user = getCurrentUser();
    const { items: initialItems, ...values } = data;
    const listsRef = firebaseServices.firestore.collection(Collections.LISTS);
    const list: Omit<List, 'id' | 'isOwner'> = {
      items: initialItems || [],
      ...values,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      ownerId: user.uid,
      modifiedBy: null
    };

    const listDoc = await listsRef.add(list);
    const createdListSnapshot = await listDoc.get();

    return createdListSnapshot.exists
      ? ({
          id: listDoc.id,
          ...createdListSnapshot.data(),
          isOwner: true
        } as List)
      : undefined;
  } catch (error: any) {
    if (error instanceof CustomError) {
      error.logToCrashlytics();
    } else {
      firebaseServices.crashlytics.recordError(error);
    }
    throw new CustomError('Failed to create list', 'CREATE_LIST_FAILED');
  }
};

// Update an existing list
const updateList = async (
  listId: string,
  updates: Partial<List>
): Promise<void> => {
  try {
    const user = getCurrentUser();
    const { isOwner: _, ...updatesValues } = updates;
    const listDocRef = firebaseServices.firestore
      .collection(Collections.LISTS)
      .doc(listId);

    await listDocRef.update({
      ...updatesValues,
      updatedAt: Timestamp.now(),
      modifiedBy: user.uid
    });
  } catch (error: any) {
    if (error instanceof CustomError) {
      error.logToCrashlytics();
    } else {
      firebaseServices.crashlytics.recordError(error);
    }
    throw new CustomError('Failed to update list', 'UPDATE_LIST_FAILED');
  }
};

// Update collaborators for a list (using Realtime Database)
const updateListCollaborators = async (
  listId: string,
  collaborators: string[]
): Promise<void> => {
  try {
    console.log('updateListCollaborators', listId, collaborators);

    const realtimeRef = firebaseServices.database.ref(
      `${Collections.LISTS}/${listId}`
    );

    if (collaborators.length > 0) {
      const data: RealtimeList = {
        listId,
        collaborators,
        updatedAt: Timestamp.now()
      };

      console.log(data);

      await realtimeRef.set(data);
    } else {
      await realtimeRef.remove();
    }
  } catch (error: any) {
    if (error instanceof CustomError) {
      error.logToCrashlytics();
    } else {
      firebaseServices.crashlytics.recordError(error);
    }
    throw new CustomError(
      'Failed to update collaborators',
      'UPDATE_COLLABORATORS_FAILED'
    );
  }
};

// Delete a list
const deleteList = async (listId: string): Promise<boolean> => {
  try {
    const listDocRef = firebaseServices.firestore
      .collection(Collections.LISTS)
      .doc(listId);
    await listDocRef.delete();
    return true;
  } catch (error: any) {
    if (error instanceof CustomError) {
      error.logToCrashlytics();
    } else {
      firebaseServices.crashlytics.recordError(error);
    }
    throw new CustomError('Failed to delete list', 'DELETE_LIST_FAILED');
  }
};

const ListsService = {
  create: createList,
  list: getLists,
  get: getListById,
  update: updateList,
  updateCollaborators: updateListCollaborators,
  delete: deleteList
};

export default ListsService;
