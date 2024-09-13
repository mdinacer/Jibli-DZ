import { ProductUnit } from '@/models/ProductUnit';
import { Timestamp } from '@react-native-firebase/firestore';
import { z } from 'zod';

export enum ListItemStatus {
  BOUGHT = 'bought',
  PENDING = 'pending',
  UNAVAILABLE = 'unavailable'
}

export const ListItemInputSchema = z.object({
  name: z.string(),
  quantity: z.number(),
  unit: z.nativeEnum(ProductUnit),
  note: z.string().nullable()
});

export type ListItemInput = z.infer<typeof ListItemInputSchema>;

export const ListItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  quantity: z.number(),
  unit: z.nativeEnum(ProductUnit),
  status: z.nativeEnum(ListItemStatus),
  note: z.string().nullable(),
  createdAt: z.instanceof(Timestamp),
  updatedAt: z.instanceof(Timestamp)
});

export type ListItem = z.infer<typeof ListItemSchema>;

export const StatusOrder = [
  ListItemStatus.PENDING,
  ListItemStatus.UNAVAILABLE,
  ListItemStatus.BOUGHT
];
