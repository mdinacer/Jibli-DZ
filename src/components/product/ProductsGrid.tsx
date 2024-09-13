import { mockProducts } from '@/data/mock-data';
import React, { useMemo } from 'react';
import { Dimensions, FlatList } from 'react-native';
import ProductDisplay from '@/components/product/ProductDisplay';

const COLS_COUNT = 2;
const ITEMS_SPACING = 0;
const ITEM_PADDING = 16;
const ProductsGrid = () => {
  const products = mockProducts;

  const itemSize = useMemo(() => {
    const { width } = Dimensions.get('window');
    const itemSize =
      (width - ITEM_PADDING * 2 - (COLS_COUNT - 1) * ITEMS_SPACING) /
      COLS_COUNT;
    return itemSize;
  }, []);
  return (
    <FlatList
      style={{ flex: 1 }}
      data={mockProducts}
      numColumns={COLS_COUNT}
      columnWrapperStyle={{
        gap: ITEMS_SPACING,
        paddingHorizontal: ITEM_PADDING
      }}
      contentContainerStyle={{ gap: ITEMS_SPACING }}
      keyExtractor={(item) => item.id}
      renderItem={({ item: product }) => (
        <ProductDisplay product={product} size={itemSize} />
      )}
    />
  );
};

export default ProductsGrid;
