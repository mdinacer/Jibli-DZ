import IconButton from '@/components/IconButton';
import ItemDisplay from '@/components/item/ItemDisplay';
import { Icons } from '@/constants';
import { ThemeType } from '@/constants/Colors';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ListItem } from '@/models/ListItem';
import React, { useCallback } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
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
        <View style={styles.actionsContainer}>
          <View style={styles.iconButtonWrapper}>
            <IconButton
              style={styles.iconButton}
              iconStyles={{ ...styles.icon, color: theme.foreground }}
              icon={Icons.PencilEditIcon}
              onPress={() => {
                swipeable.close();
                onEdit();
              }}
            />
          </View>
          <View style={styles.iconButtonWrapper}>
            <IconButton
              icon={Icons.TrashIcon}
              style={styles.iconButton}
              iconStyles={{ ...styles.icon, color: theme.destructive }}
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
        <View style={styles.itemContainer}>
          <ItemDisplay item={item} />
        </View>
      </Swipeable>
    </GestureHandlerRootView>
  );
};

export default UserItemDisplay;

const styles = StyleSheet.create({
  itemContainer: {
    padding: 4
  },
  actionsContainer: {
    flexDirection: 'row',
    columnGap: 8,
    overflow: 'hidden',
    padding: 4
  },
  iconButtonWrapper: {
    height: '100%'
  },
  iconButton: {
    height: '100%',
    width: 56,
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
    height: 24,
    width: 24
  }
});
