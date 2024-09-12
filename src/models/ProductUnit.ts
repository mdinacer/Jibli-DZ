export enum UnitCategory {
  Packaging = 'Packaging',
  Weight = 'Weight'
}

export const ProductUnitsList = [
  { label: 'Bag', value: 'bag' },
  { label: 'Bottle', value: 'bottle' },
  { label: 'Box', value: 'box' },
  { label: 'Can', value: 'can' },
  { label: 'Jar', value: 'jar' },
  { label: 'Kilogram', value: 'kilogram' },
  { label: 'Gram', value: 'gram' },
  { label: 'Pack', value: 'pack' },
  { label: 'Piece', value: 'piece' }
];

export enum ProductUnit {
  Bag = 'bag',
  Bottle = 'bottle',
  Box = 'box',
  Can = 'can',
  Jar = 'jar',
  Kilogram = 'kilogram',
  Gram = 'gram',
  Pack = 'pack',
  Piece = 'piece'
}

// Update the conversion factors accordingly
export const conversionFactors: Record<ProductUnit, number | null> = {
  [ProductUnit.Piece]: null,
  [ProductUnit.Box]: null,
  [ProductUnit.Pack]: null,
  [ProductUnit.Bottle]: null,
  [ProductUnit.Kilogram]: 1, // 1 kilogram = 1 kilogram
  [ProductUnit.Gram]: 0.001, // 1 gram = 0.001 kilograms
  [ProductUnit.Can]: null,
  [ProductUnit.Bag]: null,
  [ProductUnit.Jar]: null
};

const unitsByCategory: Record<UnitCategory, ProductUnit[]> = {
  [UnitCategory.Packaging]: [
    ProductUnit.Piece,
    ProductUnit.Box,
    ProductUnit.Pack,
    ProductUnit.Bottle,
    ProductUnit.Can,
    ProductUnit.Bag,
    ProductUnit.Jar
  ],
  [UnitCategory.Weight]: [ProductUnit.Kilogram, ProductUnit.Gram]
};

// Function to get the category of a unit
export function getUnitCategory(unit: ProductUnit): UnitCategory | undefined {
  for (const [category, units] of Object.entries(unitsByCategory)) {
    if (units.includes(unit)) {
      return category as UnitCategory;
    }
  }
  return undefined;
}

export function getUnitsByCategory(category: UnitCategory): ProductUnit[] {
  return unitsByCategory[category];
}
