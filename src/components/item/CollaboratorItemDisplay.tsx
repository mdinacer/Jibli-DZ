import ItemDisplay from '@/components/item/ItemDisplay';
import { Icons } from '@/constants';
import { ItemStatusStyles, ListItem, ListItemStatus } from '@/models/ListItem';
import React, { useCallback } from 'react';
import { View } from 'react-native';
import {
  GestureHandlerRootView,
  Swipeable
} from 'react-native-gesture-handler';
import { SvgProps } from 'react-native-svg';

interface Props {
  item: ListItem;
  onStatusChange: (status: ListItemStatus) => void;
}

// const ItemStatusStyles = {
//   [ListItemStatus.PENDING]: 'bg-[#FF885B]',
//   [ListItemStatus.BOUGHT]: 'bg-[#8FD14F]',
//   [ListItemStatus.UNAVAILABLE]: 'bg-[#C7253E]'
// };

const CollaboratorItemDisplay: React.FC<Props> = ({ item, onStatusChange }) => {
  const renderRightActions = useCallback(() => {
    return (
      <SwipeAction
        backgroundColor={
          ItemStatusStyles[ListItemStatus.UNAVAILABLE].background
        }
        containerStyle={` justify-end`}
        itemStatus={item.status}
        icon={Icons.UnavailableIcon}
      />
    );
  }, [item.status]);
  const renderLeftActions = useCallback(() => {
    return (
      <SwipeAction
        backgroundColor={ItemStatusStyles[ListItemStatus.BOUGHT].background}
        containerStyle={` `}
        itemStatus={item.status}
        icon={Icons.ShoppingBasketIcon}
      />
    );
  }, [item.status]);

  const handleOnSwipe = useCallback(
    (direction: 'left' | 'right', swipeable: Swipeable) => {
      if (item.status !== ListItemStatus.PENDING) {
        onStatusChange(ListItemStatus.PENDING);
        swipeable.close();
        return;
      }

      if (direction === 'left') {
        onStatusChange(ListItemStatus.BOUGHT);
      } else if (direction === 'right') {
        onStatusChange(ListItemStatus.UNAVAILABLE);
      }

      swipeable.close();
    },
    [item.status, onStatusChange]
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
        onSwipeableOpen={handleOnSwipe}
      >
        <View className="w-full items-center">
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
      className={`h-full flex-1 flex-row items-center rounded-lg p-4 transition-colors ${itemStatus !== ListItemStatus.PENDING ? 'bg-[#FFC470]' : backgroundColor} ${containerStyle}`}
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
