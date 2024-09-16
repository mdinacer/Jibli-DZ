import { List } from '@/models/List';
import { ListItem, ListItemStatus } from '@/models/ListItem';
import { Timestamp } from '@react-native-firebase/firestore';

export type SharedListReducerPropsType = {
  state: SharedListReducerState;
  dispatch: React.Dispatch<SharedListReducerAction>;
};
export interface SharedListReducerState {
  list: List;
}

export type SharedListReducerAction =
  | { action: 'SET_LIST'; payload: { list: List } }
  | {
      action: 'UPDATE_ITEM_STATUS';
      payload: { itemId: string; status: ListItemStatus };
    };

const updateListItems = (
  items: ListItem[],
  itemId: string,
  status: ListItemStatus
): ListItem[] => {
  return items.map((item) =>
    item.id === itemId ? { ...item, status, updatedAt: Timestamp.now() } : item
  );
};

export const SharedListReducer = (
  state: SharedListReducerState,
  action: SharedListReducerAction
): SharedListReducerState => {
  switch (action.action) {
    case 'SET_LIST':
      return {
        ...state,
        list: action.payload.list
      };
    case 'UPDATE_ITEM_STATUS':
      return state.list
        ? {
            ...state,
            list: {
              ...state.list,
              items: updateListItems(
                state.list.items,
                action.payload.itemId,
                action.payload.status
              )
            }
          }
        : state;
    default:
      return state;
  }
};
