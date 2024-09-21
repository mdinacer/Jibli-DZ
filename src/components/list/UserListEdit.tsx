import IconButton from '@/components/IconButton';
import UserItemDisplay from '@/components/item/UserItemDisplay';
import useUserListEdit from '@/components/list/useUserListEdit';
import { Icons } from '@/constants';
import { ListItem } from '@/models/ListItem';
import { Redirect, router } from 'expo-router';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, FlatList, Text, View } from 'react-native';

const UserListEdit = () => {
  const { t } = useTranslation('common');
  const { list, modified, state, discardChanges, removeItem, saveChanges } =
    useUserListEdit();

  const handleDeleteItemPrompt = useCallback(
    (item: ListItem) => {
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
    },
    [removeItem, t]
  );

  if (!list) {
    return <Redirect href="/home" />;
  }

  return (
    <View className="relative">
      <View className="h-full">
        <View className="p-4">
          <Text className="font-pmedium text-lg">{list?.name}</Text>
        </View>

        <FlatList<ListItem>
          className="flex-1 px-4"
          data={list.items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 80 }}
          renderItem={({ item }) => (
            <UserItemDisplay
              item={item}
              onEdit={() => {
                router.push(`/item/${item.id}`);
                //handleSelectItem(item, 'edit');
              }}
              onDelete={() => {
                handleDeleteItemPrompt(item);
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
            onPress={() => router.push('/item/new')}
            icon={Icons.PlusIcon}
          />
          <IconButton
            variant="bordered"
            icon={modified ? Icons.CancelIcon : Icons.ArrowTurnBackwardIcon}
            onPress={discardChanges}
          />
        </View>
      </View>
    </View>
  );
};

export default UserListEdit;
