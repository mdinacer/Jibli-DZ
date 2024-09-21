import { List } from '@/models/List';
import { ListItemStatus } from '@/models/ListItem';
import { useCollaboratorStore } from '@/stores/useCollaboratorStore';
import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import Squircle from '../Squircle';
import CollaboratorDetails from '../collaborator/CollaboratorDetails';

interface Props {
  list: List;
  width: number;
}

const SharedListDisplay: React.FC<Props> = ({ list, width }) => {
  const { t } = useTranslation('common');
  const owner = useCollaboratorStore((state) =>
    state.collaborators.find((c) => c.userId === list.ownerId)
  );

  const itemsDetails = useMemo(
    () =>
      list.items.length > 0
        ? list.items.reduce(
            (acc, item) => {
              if (item.status === ListItemStatus.PENDING) acc.pendingCount++;
              else if (item.status === ListItemStatus.BOUGHT) acc.boughtCount++;
              else if (item.status === ListItemStatus.UNAVAILABLE)
                acc.unavailableCount++;
              return acc;
            },
            { pendingCount: 0, boughtCount: 0, unavailableCount: 0 }
          )
        : undefined,
    [list]
  );

  if (!owner) return null;
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={list.items.length === 0}
      style={{ width, height: '100%' }}
      className="min-h-[200px] w-full"
      onPress={() => router.push(`/list/${list.id}`)}
    >
      <View className="w-full rounded-2xl bg-background p-6 shadow-sm">
        <CollaboratorDetails collaborator={owner} title={list.name} />

        {itemsDetails ? (
          <View className="w-full flex-row items-center justify-evenly">
            <InfoBox
              title={t('item_status.pending')}
              value={itemsDetails.pendingCount}
            />
            <InfoBox
              title={t('item_status.bought')}
              value={itemsDetails.boughtCount}
            />
            <InfoBox
              title={t('item_status.unavailable')}
              value={itemsDetails.unavailableCount}
            />
          </View>
        ) : (
          <View className="w-full flex-row items-center justify-evenly">
            <Text>This list is empty at the moment</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default SharedListDisplay;

interface InfoBoxProps {
  title: string;
  value?: string | number | boolean;
}
const InfoBox: React.FC<InfoBoxProps> = ({ title, value }) => {
  return (
    <View className="items-center justify-center">
      <Text className="font-pbold text-2xl">{value}</Text>
      <Text className="font-pregular text-base">{title}</Text>
    </View>
  );
};
