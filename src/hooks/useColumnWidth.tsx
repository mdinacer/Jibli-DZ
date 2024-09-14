import { useMemo } from 'react';
import { Dimensions } from 'react-native';

interface Props {
  colsCount: number;
  itemsSpacing: number;
  itemPadding: number;
}

export function useColumnWidth({
  colsCount,
  itemsSpacing,
  itemPadding
}: Props) {
  const { width } = Dimensions.get('window');

  const size = useMemo(
    () =>
      (width - itemPadding * 2 - (colsCount - 1) * itemsSpacing) / colsCount,
    [colsCount, itemPadding, itemsSpacing, width]
  );
  return {
    size
  };
}
