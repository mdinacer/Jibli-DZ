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
  quantity: z.coerce.number(),
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

export const ItemStatusStyles = {
  [ListItemStatus.PENDING]: {
    background: 'bg-background',
    text: 'text-primary',
    muted: 'text-muted-foreground'
  },
  [ListItemStatus.BOUGHT]: {
    background: 'bg-[#A2C579]',
    text: 'text-[#F2FFE9]',
    muted: 'text-[#F2FFE9CC]'
  },
  [ListItemStatus.UNAVAILABLE]: {
    background: 'bg-[#DD5746]',
    text: 'text-[#FAF3F3]',
    muted: 'text-white/70'
  }
};
