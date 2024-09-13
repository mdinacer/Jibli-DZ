import ItemDisplay from '@/components/item/ItemDisplay';
import { ListItem } from '@/models/ListItem';
import React, { useCallback } from 'react';
import { Animated, Button, View } from 'react-native';
import {
  GestureHandlerRootView,
  Swipeable
} from 'react-native-gesture-handler';

interface Props {
  item: ListItem;
  onEdit: () => void;
  onDelete: () => void;
}

const UserItemDisplay: React.FC<Props> = ({ item, onDelete, onEdit }) => {
  const renderRightActions = useCallback(
    (
      progress: Animated.AnimatedInterpolation<string | number>,
      _: Animated.AnimatedInterpolation<string | number>,
      swipeable: Swipeable
    ) => {
      return (
        <View>
          <View>
            <Button
              title="edit"
              onPress={() => {
                swipeable.close();
                onEdit();
              }}
            />
          </View>
          <View>
            <Button
              title="delete"
              onPress={() => {
                swipeable.close();
                onDelete();
              }}
            />
          </View>
        </View>
      );
    },
    [onDelete, onEdit]
  );

  return (
    <GestureHandlerRootView>
      <Swipeable
        friction={2}
        rightThreshold={60}
        renderRightActions={renderRightActions}
      >
        <View>
          <ItemDisplay item={item} />
        </View>
      </Swipeable>
    </GestureHandlerRootView>
  );
};

export default UserItemDisplay;
