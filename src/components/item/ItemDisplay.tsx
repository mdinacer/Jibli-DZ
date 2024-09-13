import { ListItem } from '@/models/ListItem';
import React from 'react';
import { Image } from 'tamagui';
import { SizableText, Square, Text, XStack, YStack } from 'tamagui';

interface Props {
  item: ListItem;
}

const ItemDisplay: React.FC<Props> = ({ item }) => {
  return (
    <XStack
      elevation={2}
      padding="$2"
      alignItems="center"
      backgroundColor={'$background'}
      borderRadius={'$1'}
      overflow="hidden"
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

      <YStack paddingVertical="$2" paddingHorizontal="$4" flex={1}>
        <XStack alignItems="center">
          <SizableText size="$4" fontWeight="800" flex={1}>
            {item.name}
          </SizableText>
          <Text>
            {item.quantity} {item.unit}
          </Text>
        </XStack>
        <Text>{item.note}</Text>
      </YStack>
    </XStack>
  );
};

export default ItemDisplay;
