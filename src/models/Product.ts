import { FileAssetSchema } from '@/models/FileAsset';
import { ProductUnit } from '@/models/ProductUnit';
import { Timestamp } from '@react-native-firebase/firestore';
import { z } from 'zod';

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  unit: z.nativeEnum(ProductUnit),
  image: FileAssetSchema.nullable(),
  category: z.string(),
  createdAt: z.instanceof(Timestamp),
  updatedAt: z.instanceof(Timestamp)
});

export type Product = z.infer<typeof ProductSchema>;

export type ProductCreateInput = Omit<
  Product,
  'id' | 'createdAt' | 'updatedAt'
>;
