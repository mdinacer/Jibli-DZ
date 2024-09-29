import ItemDisplay from '@/components/item/ItemDisplay';
import { Icons } from '@/constants';
import { ItemStatusStyles, ListItem, ListItemStatus } from '@/models/ListItem';
import React, { useCallback } from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import {
  GestureHandlerRootView,
  Swipeable
} from 'react-native-gesture-handler';
import { SvgProps } from 'react-native-svg';

interface Props {
  item: ListItem;
  onStatusChange: (status: ListItemStatus) => void;
}

const CollaboratorItemDisplay: React.FC<Props> = ({ item, onStatusChange }) => {
  const renderRightActions = useCallback(() => {
    return (
      <SwipeAction
        backgroundColor={ItemStatusStyles[ListItemStatus.UNAVAILABLE]}
        style={styles.rightAction}
        itemStatus={item.status}
        icon={Icons.UnavailableIcon}
      />
    );
  }, [item.status]);

  const renderLeftActions = useCallback(() => {
    return (
      <SwipeAction
        backgroundColor={ItemStatusStyles[ListItemStatus.BOUGHT]}
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
        <View style={styles.itemDisplayContainer}>
          <ItemDisplay item={item} />
        </View>
      </Swipeable>
    </GestureHandlerRootView>
  );
};

export default CollaboratorItemDisplay;

interface SwipeActionProps extends ViewProps {
  backgroundColor?: string;
  iconProps?: SvgProps;
  itemStatus: ListItemStatus;
  icon: (props: SvgProps) => JSX.Element;
}
const SwipeAction: React.FC<SwipeActionProps> = ({
  iconProps,
  itemStatus,
  backgroundColor,
  style,
  icon: Icon
}) => {
  return (
    <View
      style={[
        styles.swipeAction,
        {
          backgroundColor:
            itemStatus !== ListItemStatus.PENDING ? '#FFC470' : backgroundColor
        },
        style
      ]}
    >
      <View style={styles.iconContainer}>
        {itemStatus !== ListItemStatus.PENDING ? (
          <Icons.ArrowReloadHorizontalIcon
            style={styles.icon}
            color={'white'}
          />
        ) : (
          <Icon style={styles.icon} color={'white'} {...iconProps} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemDisplayContainer: {
    width: '100%',
    alignItems: 'center',
    padding: 2
  },
  rightAction: {
    justifyContent: 'flex-end'
  },
  swipeAction: {
    height: '100%',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    padding: 16
  },
  iconContainer: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
    height: 32,
    width: 32
  }
});
