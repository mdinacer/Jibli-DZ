import { Icons } from '@/constants';
import { List } from '@/models/List';
import { ListItemStatus } from '@/models/ListItem';
import { useCollaboratorStore } from '@/stores/useCollaboratorStore';
import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  list: List;
  width: number;
}

const SharedListDisplay: React.FC<Props> = ({ list, width }) => {
  const { t } = useTranslation('common');
  const owner = useCollaboratorStore((state) =>
    state.collaborators.find((c) => c.userId === list.ownerId)
  );

  const pendingItems = useMemo(
    () => list.items.filter((i) => i.status === ListItemStatus.PENDING),
    [list.items]
  );

  if (!owner) return null;
  return (
    <TouchableOpacity
      style={{ width }}
      className="h-[120px] w-full justify-center rounded-lg bg-card px-4 py-2 shadow-sm"
      onPress={() => router.push(`/list/${list.id}`)}
    >
      <View className="flex-row items-center space-x-4">
        <View className="h-full items-center justify-center">
          {owner.picture ? (
            <Image
              resizeMode="cover"
              source={{ uri: owner.picture }}
              className="h-14 w-14 rounded-full"
            />
          ) : (
            <View className="h-14 w-14 items-center justify-center rounded-full bg-gray-200">
              <Icons.UserIcon className="h-8 w-8 text-muted" />
            </View>
          )}
        </View>
        <View className="flex-1">
          <Text className="font-pregular text-base text-muted-foreground">
            {owner.username}
          </Text>
          <Text className="font-psemibold text-lg">{list.name}</Text>
        </View>

        {pendingItems.length > 0 ? (
          <View className="flex-row items-center justify-end space-x-1">
            <Text className="font-pblack text-[32px] leading-tight">
              {pendingItems.length}
            </Text>
            <Text className="font-psemibold text-sm uppercase text-muted-foreground">
              {t(ListItemStatus.PENDING, { keyPrefix: 'item_status' })}
            </Text>
          </View>
        ) : (
          <Text className="font-pregular text-sm uppercase text-muted-foreground">
            All set
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default SharedListDisplay;
