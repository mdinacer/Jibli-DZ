import { ThemeType } from '@/constants/Colors';
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
  const colorScheme = useColorScheme();

  const lightShadowColor = 'rgba(19, 23, 34, 0.1)';
  const darkShadowColor = 'rgba(250, 250, 250, 0.1)';

  return (
    <View
      style={{
        minHeight: 60,
        width: '100%',
        borderRadius: 8,
        backgroundColor: color || theme.background,
        padding: 16,
        shadowColor:
          colorScheme === 'dark' ? darkShadowColor : lightShadowColor,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 2
      }}
    >
      <View style={{ flex: 1, rowGap: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text
            style={{
              flex: 1,
              fontFamily: 'Poppins-SemiBold',
              fontSize: 18,
              lineHeight: 24
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
                lineHeight: 24
              }}
            >
              {item.quantity}
            </Text>
            <Text>{t(item.unit, { keyPrefix: 'units' })}</Text>
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
