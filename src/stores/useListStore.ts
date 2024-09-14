import { List } from '@/models/List';
import { ListItem } from '@/models/ListItem';
import listsService from '@/services/ListService';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface ListState {
  lists: List[];
  loaded: boolean;
  loading: boolean;
  error: string | null;
  setLoadingStatus: (isLoading: boolean, isLoaded?: boolean) => void;
  setError: (error: string | null) => void;
  setLists: (lists: List[]) => void;
  addList: (list: List) => void;
  updateList: (listId: string, data: Partial<List>) => void;
  updateItem: (listId: string, itemId: string, data: Partial<ListItem>) => void;
  removeList: (listId: string) => void;
  upsertList: (list: List) => void;
  fetchLists: () => Promise<void>;
  fetchList: (listId: string) => Promise<void>;
}

const initialState: Pick<ListState, 'lists' | 'loaded' | 'loading' | 'error'> =
  {
    lists: [],
    loaded: false,
    loading: false,
    error: null
  };

export const useListStore = create<ListState>()(
  devtools(
    (set, get) => ({
      ...initialState,
      setLoadingStatus: (isLoading, isLoaded = get().loaded) =>
        set(
          { loading: isLoading, loaded: isLoaded },
          false,
          'setLoadingStatus'
        ),
      setError: (error) => set({ error }, false, 'setError'),
      setLists: (lists) => set({ lists }, false, 'setLists'),
      addList: (list) => {
        set((state) => ({ lists: [...state.lists, list] }), false, 'addList');
      },
      updateList: (listId, data) => {
        set(
          (state) => ({
            lists: state.lists.map((list) =>
              list.id === listId ? { ...list, ...data } : list
            )
          }),
          false,
          'updateList'
        );
      },
      updateItem: (listId, itemId, data) => {
        set(
          (state) => {
            const list = state.lists.find((l) => l.id === listId);
            if (list) {
              const updatedItems = list.items.map((item) =>
                item.id === itemId ? { ...item, ...data } : item
              );
              const updatedList = { ...list, items: updatedItems };
              return {
                lists: state.lists.map((l) =>
                  l.id === listId ? updatedList : l
                )
              };
            }
            return state;
          },
          false,
          'updateItem'
        );
      },
      removeList: (listId) => {
        set(
          (state) => ({
            lists: state.lists.filter((list) => list.id !== listId)
          }),
          false,
          'removeList'
        );
      },
      upsertList: (list) => {
        set(
          (state) => {
            const existingListIndex = state.lists.findIndex(
              (l) => l.id === list.id
            );
            if (existingListIndex >= 0) {
              return {
                lists: state.lists.map((l, index) =>
                  index === existingListIndex ? { ...l, ...list } : l
                )
              };
            } else {
              return { lists: [...state.lists, list] };
            }
          },
          false,
          'upsertList'
        );
      },
      fetchLists: async () => {
        set({ loading: true }, false, 'fetchLists');

        try {
          const lists = await listsService.list();

          const sortedLists =
            lists.length > 0
              ? lists.sort((a, b) =>
                  a.isOwner === b.isOwner ? 0 : a.isOwner ? -1 : 1
                )
              : [];
          set(
            { lists: sortedLists, loaded: true, loading: false },
            false,
            'fetchLists'
          );
        } catch (error) {
          console.error('Error fetching lists:', error);
          set({ loading: false, loaded: true }, false, 'fetchLists');
        }
      },
      fetchList: async (listId: string) => {
        set({ loading: true }, false, 'fetchList');

        try {
          const list = await listsService.get(listId);
          if (list) {
            get().upsertList(list);
          } else {
            console.error('No such list with ID:', listId);
          }
          set({ loading: false }, false, 'fetchList');
        } catch (error) {
          console.error('Error fetching list:', error);
          set({ loading: false }, false, 'fetchList');
        }
      }
    }),
    { name: 'ListStore', store: 'list' } // Store name for devtools
  )
);
