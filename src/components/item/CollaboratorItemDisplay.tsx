import ItemDisplay from '@/components/item/ItemDisplay';
import { Icons } from '@/constants';
import { ListItem, ListItemStatus } from '@/models/ListItem';
import React, { useCallback } from 'react';
import { Animated, View } from 'react-native';
import {
  GestureHandlerRootView,
  Swipeable
} from 'react-native-gesture-handler';
import { SvgProps } from 'react-native-svg';

interface Props {
  item: ListItem;
  onStatusChange: (status: ListItemStatus) => void;
}

const colorByStatus = {
  [ListItemStatus.PENDING]: 'bg-[#FF885B]',
  [ListItemStatus.BOUGHT]: 'bg-[#8FD14F]',
  [ListItemStatus.UNAVAILABLE]: 'bg-[#C7253E]'
};

const CollaboratorItemDisplay: React.FC<Props> = ({ item, onStatusChange }) => {
  const renderRightActions = useCallback(
    (
      progress: Animated.AnimatedInterpolation<string | number>,
      dragX: Animated.AnimatedInterpolation<string | number>,
      swipeable: Swipeable
    ) => {
      return (
        <SwipeAction
          backgroundColor={colorByStatus[ListItemStatus.UNAVAILABLE]}
          containerStyle={` justify-end`}
          itemStatus={item.status}
          icon={Icons.UnavailableIcon}
        />
      );
    },
    [item.status]
  );
  const renderLeftActions = useCallback(
    (
      progress: Animated.AnimatedInterpolation<string | number>,
      dragX: Animated.AnimatedInterpolation<string | number>,
      swipeable: Swipeable
    ) => {
      return (
        <SwipeAction
          backgroundColor={colorByStatus[ListItemStatus.BOUGHT]}
          containerStyle={` `}
          itemStatus={item.status}
          icon={Icons.ShoppingBasketIcon}
        />
      );
    },
    [item.status]
  );

  return (
    <GestureHandlerRootView>
      <Swipeable
        friction={2}
        rightThreshold={60}
        leftThreshold={60}
        overshootLeft
        overshootRight
        renderRightActions={renderRightActions}
        renderLeftActions={renderLeftActions}
        onSwipeableOpen={(direction, swipeable) => {
          swipeable.close();
        }}
      >
        <View className="w-full items-center p-2">
          <ItemDisplay item={item} />
        </View>
      </Swipeable>
    </GestureHandlerRootView>
  );
};

export default CollaboratorItemDisplay;

interface SwipeActionProps {
  containerStyle?: string;
  backgroundColor?: string;
  iconStyle?: string;
  itemStatus: ListItemStatus;
  icon: (props: SvgProps) => JSX.Element;
}
const SwipeAction: React.FC<SwipeActionProps> = ({
  containerStyle,
  iconStyle,
  itemStatus,
  backgroundColor,
  icon: Icon
}) => {
  return (
    <View
      className={`h-full flex-1 flex-row items-center rounded-lg p-4 transition-colors ${itemStatus !== ListItemStatus.PENDING ? colorByStatus[ListItemStatus.PENDING] : backgroundColor} ${containerStyle}`}
    >
      <View className="h-full items-center justify-center">
        {itemStatus !== ListItemStatus.PENDING ? (
          <Icons.ArrowReloadHorizontalIcon
            className={`h-8 w-8 text-white ${iconStyle}`}
          />
        ) : (
          <Icon className={`h-8 w-8 text-white ${iconStyle}`} />
        )}
      </View>
    </View>
  );
};
