import { ListItem } from '@/models/ListItem';
import { Pencil, Trash } from '@tamagui/lucide-icons';
import React, { useCallback } from 'react';
import { Animated } from 'react-native';
import {
  GestureHandlerRootView,
  Swipeable
} from 'react-native-gesture-handler';
import { Button, Square, View, XStack } from 'tamagui';
import ItemDisplay from './ItemDisplay';

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
        <XStack>
          <Square height={'100%'} aspectRatio={1}>
            <Button
              unstyled
              alignItems="center"
              justifyContent="center"
              flex={1}
              onPress={() => {
                swipeable.close();
                onEdit();
              }}
              icon={Pencil}
              size={32}
            />
          </Square>
          <Square height={'100%'} aspectRatio={1}>
            <Button
              unstyled
              alignItems="center"
              justifyContent="center"
              flex={1}
              onPress={() => {
                swipeable.close();
                onDelete();
              }}
              icon={Trash}
              size={32}
            />
          </Square>
        </XStack>
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
        <View padding="$1">
          <ItemDisplay item={item} />
        </View>
      </Swipeable>
    </GestureHandlerRootView>
  );
};

export default UserItemDisplay;
