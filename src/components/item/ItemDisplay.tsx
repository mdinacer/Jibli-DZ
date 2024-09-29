import { shadowStyles, ThemeType } from '@/constants/Colors';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ItemStatusStyles, ListItem, ListItemStatus } from '@/models/ListItem';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useColorScheme, View } from 'react-native';
import Text from '@/components/Themed/Text';

interface Props {
  item: ListItem;
}

const ItemDisplay: React.FC<Props> = ({ item }) => {
  const { t } = useTranslation('common');
  const color = useMemo(() => ItemStatusStyles[item.status], [item.status]);
  const theme = useThemeColor({}) as ThemeType;

  return (
    <View
      style={{
        minHeight: 60,
        width: '100%',
        borderRadius: 8,
        backgroundColor: color || theme.background,
        padding: 16,
        ...shadowStyles.shadowSm
      }}
    >
      <View style={{ flex: 1, rowGap: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text
            style={{
              flex: 1,
              fontFamily: 'Poppins-SemiBold',
              fontSize: 18,
              lineHeight: 24,
              color:
                item.status === ListItemStatus.PENDING
                  ? theme.foreground
                  : theme.background
            }}
          >
            {item.name}
          </Text>
          <View
            style={{ flexDirection: 'row', alignItems: 'center', columnGap: 4 }}
          >
            <Text
              style={{
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
                lineHeight: 24,
                color:
                  item.status === ListItemStatus.PENDING
                    ? theme.foreground
                    : theme.background
              }}
            >
              {item.quantity}
            </Text>
            <Text
              style={{
                color:
                  item.status === ListItemStatus.PENDING
                    ? theme.foreground
                    : theme.background
              }}
            >
              {t(item.unit, { keyPrefix: 'units' })}
            </Text>
          </View>
        </View>
        <Text
          style={{
            color:
              item.status === ListItemStatus.PENDING
                ? theme.mutedForeground
                : 'rgba(255 255 255 / 0.8)'
          }}
        >
          {item.note}
        </Text>
      </View>
    </View>
  );
};

export default ItemDisplay;
