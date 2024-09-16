import { List } from '@/models/List';
import { ListItem, ListItemStatus } from '@/models/ListItem';

export type PendingItemsReducerPropsType = {
  state: PendingItemsReducerState;
  dispatch: React.Dispatch<PendingItemsReducerAction>;
};

export interface PendingItemsReducerState {
  lists: List[];
  isModified: boolean;
  modifiedLists: Record<string, boolean>;
}

export type PendingItemsReducerAction =
  | {
      action: 'SET_LISTS';
      payload: List[];
    }
  | {
      action: 'UPDATE_LIST_ITEM';
      payload: { listId: string; itemId: string; values: Partial<ListItem> };
    }
  | { action: 'SET_MODIFIED'; payload: boolean }
  | {
      action: 'SET_LIST_MODIFIED';
      payload: { listId: string; isModified: boolean };
    }
  | {
      action: 'RESTORE_LIST';
      payload: { listId: string };
    };

export const InitialState: PendingItemsReducerState = {
  lists: [],
  isModified: false,
  modifiedLists: {}
};

const updateListItem = (
  items: ListItem[],
  itemId: string,
  values: Partial<ListItem>
): ListItem[] => {
  return items.map((item) =>
    item.id === itemId ? { ...item, ...values } : item
  );
};

const setAllItemsToPending = (items: ListItem[]): ListItem[] => {
  return items.map((item) => ({
    ...item,
    status: ListItemStatus.PENDING
  }));
};

export const PendingItemsReducer = (
  state: PendingItemsReducerState,
  action: PendingItemsReducerAction
): PendingItemsReducerState => {
  switch (action.action) {
    case 'SET_LISTS':
      return {
        ...state,
        lists: action.payload
      };

    case 'UPDATE_LIST_ITEM': {
      const { listId, itemId, values } = action.payload;

      // Find the index of the list to update
      const listIndex = state.lists.findIndex((l) => l.id === listId);
      if (listIndex === -1) return state;

      const updatedList = {
        ...state.lists[listIndex],
        items: updateListItem(state.lists[listIndex].items, itemId, values)
      };

      // Create a new array with the updated list
      const updatedLists = [...state.lists];
      updatedLists[listIndex] = updatedList;

      return {
        ...state,
        lists: updatedLists
      };
    }

    case 'SET_MODIFIED':
      return {
        ...state,
        isModified: action.payload
      };

    case 'SET_LIST_MODIFIED': {
      const { listId, isModified } = action.payload;

      return {
        ...state,
        modifiedLists: {
          ...state.modifiedLists,
          [listId]: isModified
        },
        // Update overall modification status based on modifiedLists values
        isModified: Object.values({
          ...state.modifiedLists,
          [listId]: isModified
        }).some((modified) => modified)
      };
    }

    case 'RESTORE_LIST': {
      const { listId } = action.payload;

      // Find the index of the list to restore
      const listIndex = state.lists.findIndex((l) => l.id === listId);
      if (listIndex === -1) return state;

      const restoredList = {
        ...state.lists[listIndex],
        items: setAllItemsToPending(state.lists[listIndex].items)
      };

      // Create a new array with the restored list
      const updatedLists = [...state.lists];
      updatedLists[listIndex] = restoredList;

      return {
        ...state,
        lists: updatedLists
      };
    }

    default:
      return state;
  }
};
