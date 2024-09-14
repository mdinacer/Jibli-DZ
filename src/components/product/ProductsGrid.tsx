import { mockProducts } from '@/data/mock-data';
import React, { useMemo } from 'react';
import { Dimensions, FlatList } from 'react-native';
import ProductDisplay from '@/components/product/ProductDisplay';
import { useColumnWidth } from '@/hooks/useColumnWidth';

const COLS_COUNT = 2;
const ITEMS_SPACING = 4;
const ITEM_PADDING = 16;
const ProductsGrid = () => {
  const products = mockProducts;

  const { size: itemSize } = useColumnWidth({
    colsCount: COLS_COUNT,
    itemsSpacing: ITEMS_SPACING,
    itemPadding: ITEM_PADDING
  });

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
