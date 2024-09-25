import IconButton from '@/components/IconButton';
import ItemDisplay from '@/components/item/ItemDisplay';
import { Icons } from '@/constants';
import { ThemeType } from '@/constants/Colors';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ListItem } from '@/models/ListItem';
import React, { useCallback } from 'react';
import { Animated, View } from 'react-native';
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
  const theme = useThemeColor({}) as ThemeType;
  const renderRightActions = useCallback(
    (
      progress: Animated.AnimatedInterpolation<string | number>,
      _: Animated.AnimatedInterpolation<string | number>,
      swipeable: Swipeable
    ) => {
      return (
        <View className="flex-row space-x-2 overflow-hidden rounded-l p-1">
          <View className="h-full">
            <IconButton
              className="h-full w-full"
              style={{
                height: '100%',
                width: 56,
                alignItems: 'center',
                justifyContent: 'center'
              }}
              iconStyles={{
                height: 32,
                width: 32,
                color: theme.foreground
              }}
              icon={Icons.PencilEditIcon}
              onPress={() => {
                swipeable.close();
                onEdit();
              }}
            />
          </View>
          <View className="h-full">
            <IconButton
              className="h-full w-full"
              icon={Icons.TrashIcon}
              style={{
                height: '100%',
                width: 56,
                alignItems: 'center',
                justifyContent: 'center'
              }}
              iconStyles={{ height: 32, width: 32, color: theme.destructive }}
              onPress={() => {
                swipeable.close();
                onDelete();
              }}
            />
          </View>
        </View>
      );
    },
    [onDelete, onEdit, theme.destructive, theme.foreground]
  );

  return (
    <GestureHandlerRootView>
      <Swipeable
        friction={2}
        rightThreshold={60}
        renderRightActions={renderRightActions}
      >
        <View style={{ padding: 4 }}>
          <ItemDisplay item={item} />
        </View>
      </Swipeable>
    </GestureHandlerRootView>
  );
};

export default UserItemDisplay;
