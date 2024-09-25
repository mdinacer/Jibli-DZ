import CollaboratorDetails from '@/components/collaborator/CollaboratorDetails';
import { ThemeType } from '@/constants/Colors';
import { useThemeColor } from '@/hooks/useThemeColor';
import { List } from '@/models/List';
import { ListItemStatus } from '@/models/ListItem';
import { useCollaboratorStore } from '@/stores/useCollaboratorStore';
import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';
import { Card, CardFooter, CardHeader } from '../Card';
import Text from '../Themed/Text';

interface Props {
  list: List;
  width: number;
}

const SharedListDisplay: React.FC<Props> = ({ list, width }) => {
  const theme = useThemeColor({}) as ThemeType;

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
      style={{ width, height: '100%', minHeight: 200 }}
      onPress={() => router.push(`/list/${list.id}`)}
    >
      <Card>
        <CardHeader style={{ paddingVertical: 4 }}>
          <CollaboratorDetails collaborator={owner} title={list.name} />
        </CardHeader>

        {itemsDetails ? (
          <CardFooter
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-evenly',
              paddingVertical: 4
            }}
          >
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
          </CardFooter>
        ) : (
          <CardFooter
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-evenly'
            }}
          >
            <Text muted>This list is empty at the moment</Text>
          </CardFooter>
        )}
      </Card>
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
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Text
        style={{
          fontFamily: 'Poppins-Bold',
          fontSize: 20,
          lineHeight: 28
        }}
      >
        {value}
      </Text>
      <Text
        style={{
          fontSize: 12,
          lineHeight: 20
        }}
      >
        {title}
      </Text>
    </View>
  );
};
