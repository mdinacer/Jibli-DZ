import Text from '@/components/Themed/Text';
import { ThemeType } from '@/constants/Colors';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ListItem, ListItemStatus } from '@/models/ListItem';
import { compareItems } from '@/utils/list-utils';
import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  item: ListItem;
}

const UserListItem: React.FC<Props> = ({ item, ...props }) => {
  const theme = useThemeColor({}) as ThemeType;
  return (
    <View style={styles.container} {...props}>
      <View
        style={{
          height: 6,
          width: 6,
          borderRadius: 9999,
          backgroundColor:
            item.status === ListItemStatus.PENDING
              ? theme.mutedForeground
              : item.status === ListItemStatus.BOUGHT
                ? theme.green
                : theme.red
        }}
      />
      <Text
        muted={item.status !== ListItemStatus.PENDING}
        style={[
          styles.text,
          item.status !== ListItemStatus.PENDING && styles.textStrikethrough
        ]}
      >
        {item.name}
      </Text>
    </View>
  );
};

const isEqual = (prevProps: Props, nextProps: Props) => {
  return compareItems(prevProps.item, nextProps.item);
};

export default React.memo(UserListItem, isEqual);

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8
  },
  icon: {
    height: 20,
    width: 20
  },
  text: {
    textDecorationLine: 'none',
    fontSize: 14,
    lineHeight: 16
  },
  textStrikethrough: {
    textDecorationLine: 'line-through'
  }
});
