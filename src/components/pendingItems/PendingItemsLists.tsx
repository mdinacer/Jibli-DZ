import {
  InitialState,
  PendingItemsReducer
} from '@/components/pendingItems/pendingItemsReducer';
import { ListItem, ListItemStatus } from '@/models/ListItem';
import { useListStore } from '@/stores/useListStore';
import { sortItemByStatus } from '@/utils/list-utils';
import React, { useCallback, useEffect, useMemo, useReducer } from 'react';
import { SectionList, SectionListProps } from 'react-native';
import EmptyState from '@/components/EmptyState';
import CollaboratorItemDisplay from '@/components/item/CollaboratorItemDisplay';
import SectionHeader from '@/components/pendingItems/SectionHeader';
import { useTranslation } from 'react-i18next';

interface Props extends Partial<SectionListProps<ListItem>> {}

const PendingItemsLists: React.FC<Props> = ({ ...props }) => {
  const { t } = useTranslation('common', {
    keyPrefix: 'pending_item_empty_state'
  });
  const { lists } = useListStore();
  const [state, dispatch] = useReducer(PendingItemsReducer, InitialState);

  const loadFilteredLists = useCallback(() => {
    if (!lists.length) return;

    const filteredLists = lists
      .filter((list) => !list.isOwner) // Exclude lists where the user is the owner
      .map((l) => ({
        ...l,
        items: l.items.filter((i) => i.status === ListItemStatus.PENDING) // Only keep pending items
      }))
      .filter((l) => l.items.length > 0); // Exclude lists that have no pending items

    dispatch({ action: 'SET_LISTS', payload: filteredLists });
  }, [lists]);

  useEffect(() => {
    loadFilteredLists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lists]);

  const handleItemStatusChange = useCallback(
    (listId: string, itemId: string, status: ListItemStatus) => {
      dispatch({
        action: 'UPDATE_LIST_ITEM',
        payload: {
          listId,
          itemId,
          values: {
            status
          }
        }
      });
    },
    [dispatch]
  );

  const sections = useMemo(
    () =>
      state.lists.map((list) => ({
        listId: list.id,
        name: list.name,
        data: sortItemByStatus(list.items)
      })),
    [state.lists]
  );

  return (
    <SectionList
      className="p-4"
      style={{ flex: 1, rowGap: 16 }}
      contentContainerStyle={{ rowGap: 16, paddingVertical: 16 }}
      sections={sections}
      keyExtractor={(i) => i.id}
      renderItem={({ item, section: { listId } }) => (
        <CollaboratorItemDisplay
          item={item}
          onStatusChange={(status) => {
            handleItemStatusChange(listId, item.id, status);
          }}
        />
      )}
      renderSectionHeader={({ section: { name, listId } }) => (
        <SectionHeader
          state={state}
          dispatch={dispatch}
          listName={name}
          listId={listId}
        />
      )}
      ListEmptyComponent={
        <EmptyState title={t('title')} description={t('description')} />
      }
      {...props}
    />
  );
};

export default PendingItemsLists;
