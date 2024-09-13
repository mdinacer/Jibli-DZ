import { Product } from '@/models/Product';
import React from 'react';
import { View } from 'react-native';

interface Props {
  product: Product;
  size: number;
}

const ProductDisplay: React.FC<Props> = ({ product, size }) => {
  return <View />;
};

export default ProductDisplay;
