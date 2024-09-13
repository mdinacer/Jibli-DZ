import { Icons } from '@/constants';
import { ListItem, ListItemStatus } from '@/models/ListItem';
import React, { useCallback } from 'react';
import { Animated, FlexAlignType } from 'react-native';
import {
  GestureHandlerRootView,
  Swipeable
} from 'react-native-gesture-handler';
import { SvgProps } from 'react-native-svg';
import { View } from 'tamagui';
import ItemDisplay from './ItemDisplay';

interface Props {
  item: ListItem;
  onStatusChange: (status: ListItemStatus) => void;
}

const colorByStatus = {
  [ListItemStatus.PENDING]: '#FF885B',
  [ListItemStatus.BOUGHT]: '#8FD14F',
  [ListItemStatus.UNAVAILABLE]: '#C7253E'
};

const CollaboratorItemDisplay: React.FC<Props> = ({ item, onStatusChange }) => {
  const renderRightActions = useCallback(
    (
      progress: Animated.AnimatedInterpolation<string | number>,
      dragX: Animated.AnimatedInterpolation<string | number>,
      swipeable: Swipeable
    ) => {
      const trans = dragX.interpolate({
        inputRange: [-101, -100, -50, 0],
        outputRange: [-20, 0, 0, 1], // reversed for left swipe
        extrapolate: 'clamp'
      });

      return (
        <SwipeAction
          alignItems="flex-end"
          backgroundColor={colorByStatus[ListItemStatus.UNAVAILABLE]}
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
        <View padding="$1">
          <ItemDisplay item={item} />
        </View>
      </Swipeable>
    </GestureHandlerRootView>
  );
};

export default CollaboratorItemDisplay;

interface SwipeActionProps {
  backgroundColor: string;
  itemStatus: ListItemStatus;
  icon: (props: SvgProps) => JSX.Element;
  alignItems?: FlexAlignType | 'unset' | undefined;
}
const SwipeAction: React.FC<SwipeActionProps> = ({
  backgroundColor,
  itemStatus,
  icon: Icon,
  alignItems = 'unset'
}) => {
  return (
    <View
      flex={1}
      backgroundColor={
        itemStatus !== ListItemStatus.PENDING
          ? backgroundColor
          : colorByStatus[ListItemStatus.PENDING]
      }
      justifyContent="center"
      alignItems={alignItems}
      padding="$4"
      borderRadius={4}
    >
      {itemStatus === ListItemStatus.PENDING ? (
        <Icons.ArrowReloadHorizontalIcon
          width={32}
          height={32}
          color={'white'}
        />
      ) : (
        <Icon width={32} height={32} color={'white'} />
      )}
    </View>
  );
};
