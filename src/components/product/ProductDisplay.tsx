import { Product } from '@/models/Product';
import React from 'react';
import { Image, Text, View } from 'react-native';

interface Props {
  product: Product;
  size: number;
}

const ProductDisplay: React.FC<Props> = ({ product, size }) => {
  return (
    <View className="relative aspect-video">
      <View>
        {product.image && (
          <Image
            source={{ uri: product.image.fileUrl }}
            style={{ width: size, height: '100%' }}
          />
        )}
      </View>
      <View className="absolute inset-x-0 bottom-0 bg-black/50 px-4 py-2">
        <Text className="font-psemibold text-lg text-white">
          {product.name}
        </Text>
      </View>
    </View>
  );
};

export default ProductDisplay;
