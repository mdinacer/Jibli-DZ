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
  BAG = 'bag',
  BOTTLE = 'bottle',
  BOX = 'box',
  CAN = 'can',
  JAR = 'jar',
  KG = 'kilogram',
  GR = 'gram',
  PACK = 'pack',
  PIECE = 'piece'
}

// Update the conversion factors accordingly
export const conversionFactors: Record<ProductUnit, number | null> = {
  [ProductUnit.PIECE]: null,
  [ProductUnit.BOX]: null,
  [ProductUnit.PACK]: null,
  [ProductUnit.BOTTLE]: null,
  [ProductUnit.KG]: 1, // 1 kilogram = 1 kilogram
  [ProductUnit.GR]: 0.001, // 1 gram = 0.001 kilograms
  [ProductUnit.CAN]: null,
  [ProductUnit.BAG]: null,
  [ProductUnit.JAR]: null
};

const unitsByCategory: Record<UnitCategory, ProductUnit[]> = {
  [UnitCategory.Packaging]: [
    ProductUnit.PIECE,
    ProductUnit.BOX,
    ProductUnit.PACK,
    ProductUnit.BOTTLE,
    ProductUnit.CAN,
    ProductUnit.BAG,
    ProductUnit.JAR
  ],
  [UnitCategory.Weight]: [ProductUnit.KG, ProductUnit.GR]
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
