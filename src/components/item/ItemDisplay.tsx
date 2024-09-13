import { ListItem } from '@/models/ListItem';
import React from 'react';
import { Text, View } from 'react-native';

interface Props {
  item: ListItem;
}

const ItemDisplay: React.FC<Props> = ({ item }) => {
  return (
    <View>
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

      <View>
        <View>
          <Text>{item.name}</Text>
          <Text>
            {item.quantity} {item.unit}
          </Text>
        </View>
        <Text>{item.note}</Text>
      </View>
    </View>
  );
};

export default ItemDisplay;
