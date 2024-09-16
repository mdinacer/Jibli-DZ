import { ItemStatusStyles, ListItem, ListItemStatus } from '@/models/ListItem';
import React, { useMemo } from 'react';
import { Text, View } from 'react-native';

interface Props {
  item: ListItem;
}

const ItemDisplay: React.FC<Props> = ({ item }) => {
  const { background, text, muted } = useMemo(
    () => ItemStatusStyles[item.status],
    [item.status]
  );

  return (
    <View
      className={`min-h-[60px] w-full rounded-lg bg-background p-4 shadow-sm ${background}`}
    >
      {/* <Square size={60} backgroundColor="$gray10Light">
        <Image
          objectFit="contain"
          height={60}
          width={60}
          source={{
            uri: 'https://placehold.co/200x200/webp',
            width: 60,
            height: 60
          }}
        />
      </Square> */}

      <View className="" style={{ flex: 1, rowGap: 2 }}>
        <View className="flex-row items-center">
          <Text className={`flex-1 font-psemibold text-lg ${text}`}>
            {item.name}
          </Text>
          <View className="flex-row items-center space-x-2">
            <Text className={`font-pbold text-lg ${text}`}>
              {item.quantity}
            </Text>
            <Text className={`font-pregular text-base ${text}`}>
              {item.unit}
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
