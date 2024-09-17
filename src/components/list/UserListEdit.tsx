import IconButton from '@/components/IconButton';
import ItemFormModal from '@/components/item/ItemFormModal';
import UserItemDisplay from '@/components/item/UserItemDisplay';
import ListCollaboratorsModal from '@/components/list/ListCollaboratorsModal';
import useUserListEdit from '@/components/list/useUserListEdit';
import { Icons } from '@/constants';
import { List } from '@/models/List';
import { ListItem } from '@/models/ListItem';
import { Redirect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, FlatList, Text, View } from 'react-native';

const UserListEdit = () => {
  const { t } = useTranslation('common');
  const {
    list,
    modals,
    modified,
    state,
    discardChanges,
    removeItem,
    saveChanges,
    toggleCollaboratorsModal,
    toggleItemFormModal
  } = useUserListEdit();

  const [selectedItem, setSelectedItem] = useState<ListItem | undefined>(
    undefined
  );

  const handleSelectItem = useCallback(
    (item: ListItem, action: 'edit' | 'delete') => {
      setSelectedItem(item);
      if (action === 'edit') {
        toggleItemFormModal(true);
      } else if (action === 'delete') {
        Alert.alert(t('item_delete.title'), t('item_delete.description'), [
          {
            text: t('item_delete.cancel'),
            style: 'cancel'
          },
          {
            text: t('item_delete.delete'),
            style: 'destructive',
            onPress: () => {
              removeItem(item.id);
            }
          }
        ]);
      }
    },
    [removeItem, t, toggleItemFormModal]
  );

  const handleItemSubmit = useCallback(() => {
    toggleItemFormModal(false);
    setSelectedItem(undefined);
  }, [toggleItemFormModal]);

  const createNewItem = useCallback(() => {
    setSelectedItem(undefined);
    toggleItemFormModal(true);
  }, [toggleItemFormModal]);

  if (!list) {
    return <Redirect href="/home" />;
  }

  return (
    <View className="relative">
      <View className="h-full">
        <ListHeaderComponent
          list={list}
          onShare={() => toggleCollaboratorsModal(true)}
        />

        <FlatList<ListItem>
          className="flex-1 px-4"
          data={list.items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 80 }}
          renderItem={({ item }) => (
            <UserItemDisplay
              item={item}
              onEdit={() => {
                handleSelectItem(item, 'edit');
              }}
              onDelete={() => {
                handleSelectItem(item, 'delete');
              }}
            />
          )}
        />
      </View>

      <View className="absolute inset-x-0 bottom-0 items-center justify-center px-8 pb-5">
        <View
          //style={{ backgroundColor: 'rgba(107,114,128,0.3)' }}
          className="w-full flex-row items-center justify-between space-x-8 rounded-full border border-border bg-gray-400/20 px-4 py-2"
        >
          <IconButton
            disabled={!modified || state.saving}
            variant="bordered"
            icon={Icons.CheckIcon}
            onPress={saveChanges}
          />
          <IconButton
            variant="default"
            className="bg-pink-500"
            onPress={createNewItem}
            icon={Icons.PlusIcon}
          />
          <IconButton
            variant="bordered"
            icon={modified ? Icons.CancelIcon : Icons.ArrowTurnBackwardIcon}
            onPress={discardChanges}
          />
        </View>
      </View>

      <ItemFormModal
        open={modals.form}
        key={selectedItem?.id || 'newItem'}
        item={selectedItem}
        onSubmit={handleItemSubmit}
        setOpen={toggleItemFormModal}
      />

      <ListCollaboratorsModal
        open={modals.collaborators}
        setOpen={toggleCollaboratorsModal}
      />
    </View>
  );
};

export default UserListEdit;

const ListHeaderComponent = ({
  list,
  onShare
}: {
  list: List;
  onShare: () => void;
}) => {
  return (
    <View className="flex-row items-center p-4">
      <View className="flex-1">
        <Text className="font-pmedium text-lg">{list?.name}</Text>
      </View>
      <View>
        <IconButton
          //disabled={collaborators.length === 0}
          onPress={onShare}
          icon={Icons.ShareIcon}
          variant="secondary"
          size="icon"
        />
      </View>
    </View>
  );
};
