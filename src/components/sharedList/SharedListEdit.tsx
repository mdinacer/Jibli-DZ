import IconButton from '@/components/IconButton';
import useSharedListEdit from '@/components/sharedList/useSharedListEdit';
import { Icons } from '@/constants';
import { List } from '@/models/List';
import { ListItem } from '@/models/ListItem';
import { Redirect } from 'expo-router';
import React from 'react';
import { FlatList, Text, View } from 'react-native';
import CollaboratorItemDisplay from '../item/CollaboratorItemDisplay';

interface Props {
  listData: List;
}

const SharedListEdit: React.FC<Props> = ({ listData }) => {
  const {
    isSaving,
    list,
    isModified,
    discardChanges,
    saveChanges,
    handleItemStatusChange
  } = useSharedListEdit(listData);

  if (!list) {
    return <Redirect href="/home" />;
  }

  return (
    <View className="relative">
      <View className="h-full">
        <ListHeaderComponent list={list} />

        <FlatList<ListItem>
          className="flex-1 px-4"
          data={list.items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 80, rowGap: 16 }}
          renderItem={({ item }) => (
            <CollaboratorItemDisplay
              item={item}
              onStatusChange={(status) => {
                handleItemStatusChange(item.id, status);
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
            disabled={!isModified || isSaving}
            variant="bordered"
            icon={Icons.CheckIcon}
            onPress={saveChanges}
          />

          <IconButton
            variant="bordered"
            icon={isModified ? Icons.CancelIcon : Icons.ArrowTurnBackwardIcon}
            onPress={discardChanges}
          />
        </View>
      </View>
    </View>
  );
};

export default SharedListEdit;

const ListHeaderComponent = ({ list }: { list: List }) => {
  return (
    <View className="flex-row items-center p-4">
      <View className="flex-1">
        <Text className="font-pmedium text-lg">{list?.name}</Text>
      </View>
    </View>
  );
};
