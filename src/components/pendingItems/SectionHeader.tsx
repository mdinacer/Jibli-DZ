import { PendingItemsReducerPropsType } from '@/components/pendingItems/pendingItemsReducer';
import Text from '@/components/Themed/Text';
import { Icons } from '@/constants';
import { ThemeType } from '@/constants/Colors';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ListItemStatus } from '@/models/ListItem';
import listsService from '@/services/ListService';
import PushNotificationsService from '@/services/PushNotificationsService';
import { useListStore } from '@/stores/useListStore';
import React, { useCallback, useMemo, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import IconButton from '../IconButton';

interface Props extends PendingItemsReducerPropsType {
  listId: string;
  listName: string;
}
const SectionHeader: React.FC<Props> = ({
  state,
  dispatch,
  listId,
  listName
}) => {
  const theme = useThemeColor({}) as ThemeType;
  const { lists, updateList } = useListStore();
  const [saving, setSaving] = useState(false);
  const isModified = useMemo(() => {
    const list = state.lists.find((l) => l.id === listId);
    if (!list) return false;
    return list.items.some((i) => i.status !== ListItemStatus.PENDING);
  }, [listId, state.lists]);

  const handleRestoreList = useCallback(() => {
    dispatch({ action: 'RESTORE_LIST', payload: { listId } });
  }, [dispatch, listId]);

  const handleSaveChanges = useCallback(async () => {
    setSaving(true);
    try {
      const originalList = lists.find((l) => l.id === listId);
      const modifiedList = state.lists.find((l) => l.id === listId);
      if (!originalList || !modifiedList) return;
      const updatedItems = originalList.items.map((originalItem) => {
        const modifiedItem = modifiedList.items.find(
          (item) => item.id === originalItem.id
        );

        if (!modifiedItem || modifiedItem.status === ListItemStatus.PENDING) {
          return originalItem;
        }
        return {
          ...originalItem,
          status: modifiedItem.status
        };
      });
      await listsService.update(listId, {
        items: updatedItems
      });
      updateList(listId, {
        items: updatedItems
      });
      await PushNotificationsService.send({
        userId: originalList.ownerId,
        title: 'List updated',
        body: 'Your list has been updated',
        data: {
          listId
        }
      });
      // loadFilteredLists();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setSaving(false);
    }
  }, [listId, lists, state.lists, updateList]);

  return (
    <View
      style={[styles.container, { backgroundColor: theme.mutedForeground }]}
    >
      <View style={styles.leftContainer}>
        <Icons.ArrowRightIcon
          style={styles.icon}
          color={isModified ? theme.primary : theme.muted}
        />
        <Text
          style={[
            styles.listName,
            { color: isModified ? theme.primary : theme.muted }
          ]}
        >
          {listName}
        </Text>
      </View>
      <View style={styles.rightContainer}>
        <IconButton
          icon={Icons.CheckIcon}
          iconStyles={{ ...styles.iconButton, color: theme.muted }}
          onPress={handleSaveChanges}
          disabled={!isModified || saving}
        />
        <IconButton
          icon={Icons.CancelIcon}
          iconStyles={{ ...styles.iconButton, color: theme.muted }}
          onPress={handleRestoreList}
          disabled={!isModified || saving}
        />
      </View>
    </View>
  );
};

export default React.memo(SectionHeader);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8
  },
  rightContainer: {
    flexDirection: 'row',
    columnGap: 16
  },
  icon: {
    height: 24,
    width: 24
  },
  listName: {
    textTransform: 'capitalize'
  },
  iconButton: {
    height: 24,
    width: 24
  }
});
