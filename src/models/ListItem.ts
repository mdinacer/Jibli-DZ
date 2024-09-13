import { ProductUnit } from '@/models/ProductUnit';
import { Timestamp } from '@react-native-firebase/firestore';
import { z } from 'zod';

export enum ListItemStatus {
  BOUGHT = 'bought',
  PENDING = 'pending',
  UNAVAILABLE = 'unavailable'
}

export const ListItemSchema = z.object({
  id: z.string(),
  productId: z.string(),
  quantity: z.number(),
  price: z.number().nullable(),
  unit: z.nativeEnum(ProductUnit),
  status: z.nativeEnum(ListItemStatus),
  note: z.string().nullable(),
  createdAt: z.instanceof(Timestamp),
  updatedAt: z.instanceof(Timestamp)
});

export type ListItem = z.infer<typeof ListItemSchema>;

export type ListItemCreateInput = Omit<ListItem, 'id' | 'status' | 'price'>;

export const StatusOrder = [
  ListItemStatus.PENDING,
  ListItemStatus.UNAVAILABLE,
  ListItemStatus.BOUGHT
];
