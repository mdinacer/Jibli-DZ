import { List } from '@/models/List';
import { ListItem } from '@/models/ListItem';
import { create } from 'zustand';

type StoreState = 'idle' | 'pending' | 'success' | 'error' | 'no_data';

interface UserListStoreState {
  list: List | null;
  modified: boolean;
  collaboratorsModified: boolean;
  removedItems: ListItem[];
  loaded: boolean;
  state: StoreState;

  setList: (list: List) => void;
  updateList: (updater: Partial<List> | ((prevState: List) => List)) => void;
  resetList: () => void;

  addItem: (item: ListItem) => void;
  updateItem: (itemId: string, data: Partial<ListItem>) => void;
  removeItem: (itemId: string) => void;
  restoreItem: (itemId: string) => void;

  setModified: (modified: boolean) => void;
  setCollaboratorsModified: (modified: boolean) => void;
  setState: (state: StoreState) => void;
  setLoaded: (loaded: boolean) => void;
}

const initialState: Pick<
  UserListStoreState,
  | 'list'
  | 'modified'
  | 'collaboratorsModified'
  | 'removedItems'
  | 'state'
  | 'loaded'
> = {
  list: null,
  modified: false,
  collaboratorsModified: false,
  removedItems: [],
  state: 'idle',
  loaded: false
};

export const useUserListStore = create<UserListStoreState>((set) => ({
  ...initialState,

  // Set the entire list and mark it as unmodified
  setList: (list) =>
    set({ list, modified: false, collaboratorsModified: false, loaded: true }),

  // Update the list based on the provided updater function or object
  updateList: (updater) =>
    set((state) => {
      // Ensure list exists before applying updates
      if (!state.list) return state;

      const updatedList =
        typeof updater === 'function'
          ? updater(state.list)
          : { ...state.list, ...updater };

      return {
        list: updatedList,
        modified: true
      };
    }),

  // Reset the list to the initial state
  resetList: () =>
    set({
      ...initialState,
      state: 'idle',
      loaded: true
    }),

  // Add an item to the list
  addItem: (item) =>
    set((state) => ({
      list: {
        ...state.list!,
        items: [...state.list!.items, item]
      },
      modified: true
    })),

  // Update a specific item in the list
  updateItem: (itemId, data) =>
    set((state) => ({
      list: {
        ...state.list!,
        items: state.list!.items.map((item) =>
          item.id === itemId ? { ...item, ...data } : item
        )
      },
      modified: true
    })),

  // Remove an item and store it in removedItems
  removeItem: (itemId) =>
    set((state) => {
      const removedItem = state.list!.items.find((item) => item.id === itemId);
      return {
        list: {
          ...state.list!,
          items: state.list!.items.filter((item) => item.id !== itemId)
        },
        removedItems: removedItem
          ? [...state.removedItems, removedItem]
          : state.removedItems,
        modified: true
      };
    }),

  // Restore a removed item back to the list
  restoreItem: (itemId) =>
    set((state) => {
      const restoredItem = state.removedItems.find(
        (item) => item.id === itemId
      );
      return {
        list: {
          ...state.list!,
          items: restoredItem
            ? [...state.list!.items, restoredItem]
            : state.list!.items
        },
        removedItems: state.removedItems.filter((item) => item.id !== itemId),
        modified: true
      };
    }),

  // Mark the list as modified
  setModified: (modified) => set({ modified }),

  // Mark the collaborators as modified
  setCollaboratorsModified: (modified) =>
    set({ collaboratorsModified: modified }),

  // Set the store state (e.g., idle, pending, success, error) and loaded status
  setState: (state) => set({ state }),
  setLoaded: (loaded) => set({ loaded })
}));
