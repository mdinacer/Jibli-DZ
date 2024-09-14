import ItemDisplay from '@/components/item/ItemDisplay';
import { Icons } from '@/constants';
import { ListItem } from '@/models/ListItem';
import React, { useCallback } from 'react';
import { Animated, View } from 'react-native';
import {
  GestureHandlerRootView,
  Swipeable
} from 'react-native-gesture-handler';
import AppButton from '../AppButton';

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
        <View className="flex-row space-x-2 overflow-hidden rounded-l p-1">
          <View className="h-full">
            <AppButton
              variant="ghost"
              className="h-full w-full"
              icon={Icons.PencilEditIcon}
              iconStyles="h-8 w-8 text-primary"
              onPress={() => {
                swipeable.close();
                onEdit();
              }}
            ></AppButton>
          </View>
          <View className="h-full">
            <AppButton
              variant="ghost"
              className="h-full w-full"
              icon={Icons.TrashIcon}
              iconStyles="h-8 w-8 text-destructive"
              onPress={() => {
                swipeable.close();
                onDelete();
              }}
            ></AppButton>
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
        <View className="p-1">
          <ItemDisplay item={item} />
        </View>
      </Swipeable>
    </GestureHandlerRootView>
  );
};

export default UserItemDisplay;
