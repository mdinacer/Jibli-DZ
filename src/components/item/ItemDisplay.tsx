import { ItemStatusStyles, ListItem } from '@/models/ListItem';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

interface Props {
  item: ListItem;
}

const ItemDisplay: React.FC<Props> = ({ item }) => {
  const { t } = useTranslation('common');
  const { background, text, muted } = useMemo(
    () => ItemStatusStyles[item.status],
    [item.status]
  );

  return (
    <View
      className={`min-h-[60px] w-full rounded-lg bg-background p-4 shadow-sm ${background}`}
    >
      <View style={{ flex: 1, rowGap: 2 }}>
        <View className="flex-row items-center">
          <Text className={`flex-1 font-psemibold text-lg ${text}`}>
            {item.name}
          </Text>
          <View className="flex-row items-center space-x-2">
            <Text className={`font-pbold text-lg ${text}`}>
              {item.quantity}
            </Text>
            <Text className={`font-pregular text-base ${text}`}>
              {t(item.unit, { keyPrefix: 'units' })}
            </Text>
          </View>
        </View>
        <Text
          className={`font-pregular text-base text-muted-foreground ${muted}`}
        >
          {item.note}
        </Text>
      </View>
    </View>
  );
};

export default ItemDisplay;
