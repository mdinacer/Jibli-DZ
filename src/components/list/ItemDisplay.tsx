import { Icons } from '@/constants';
import { ListItemStatus, ListItem } from '@/models/ListItem';
import { compareItems } from '@/utils/list-utils';
import React, { useMemo } from 'react';
import { Text, View, ViewProps } from 'react-native';
import { SvgProps } from 'react-native-svg';

const itemStatusIcon: Record<ListItemStatus, (props: SvgProps) => JSX.Element> =
  {
    [ListItemStatus.PENDING]: Icons.CircleIcon,
    [ListItemStatus.UNAVAILABLE]: Icons.UnavailableIcon,
    [ListItemStatus.BOUGHT]: Icons.CheckIcon
  };

interface Props extends ViewProps {
  item: ListItem;
}

const ItemDisplay: React.FC<Props> = ({ item, ...props }) => {
  const Icon = useMemo(() => itemStatusIcon[item.status], [item.status]);
  return (
    <View className="flex-row items-center space-x-2" {...props}>
      <Icon className="h-5 w-5 text-primary" />
      <Text
        className={`font-pregular text-sm ${item.status !== ListItemStatus.PENDING && 'text-muted-foreground line-through'}`}
      >
        {item.name}
      </Text>
    </View>
  );
};

const isEqual = (prevProps: Props, nextProps: Props) => {
  return compareItems(prevProps.item, nextProps.item);
};

export default React.memo(ItemDisplay, isEqual);
