import { Icons } from '@/constants';
import { ListItemStatus, ListItem } from '@/models/ListItem';
import { compareItems } from '@/utils/list-utils';
import React, { useMemo } from 'react';
import { View, ViewProps } from 'react-native';
import { SvgProps } from 'react-native-svg';
import Text from '@/components/Themed/Text';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemeType } from '@/constants/Colors';

const itemStatusIcon: Record<ListItemStatus, (props: SvgProps) => JSX.Element> =
  {
    [ListItemStatus.PENDING]: Icons.CircleIcon,
    [ListItemStatus.UNAVAILABLE]: Icons.UnavailableIcon,
    [ListItemStatus.BOUGHT]: Icons.CheckIcon
  };

interface Props extends ViewProps {
  item: ListItem;
}

const UserListItem: React.FC<Props> = ({ item, ...props }) => {
  const { primary } = useThemeColor({}) as ThemeType;
  const Icon = useMemo(() => itemStatusIcon[item.status], [item.status]);
  return (
    <View className="flex-row items-center space-x-2" {...props}>
      <Icon color={primary} style={{ height: 20, width: 20 }} />
      <Text
        muted={item.status !== ListItemStatus.PENDING}
        style={{
          textDecorationLine:
            item.status !== ListItemStatus.PENDING ? 'line-through' : 'none'
        }}
      >
        {item.name}
      </Text>
    </View>
  );
};

const isEqual = (prevProps: Props, nextProps: Props) => {
  return compareItems(prevProps.item, nextProps.item);
};

export default React.memo(UserListItem, isEqual);
