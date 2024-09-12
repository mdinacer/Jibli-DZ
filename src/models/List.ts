import { ListItem, ListItemStatus } from '@/models/ListItem';
import { Timestamp } from 'firebase/firestore';
import { z } from 'zod';
import { ProductUnit } from './ProductUnit';

export const ListItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  quantity: z.number(),
  price: z.number().nullable(),
  unit: z.nativeEnum(ProductUnit),
  status: z.nativeEnum(ListItemStatus),
  note: z.string().nullable(),
  createdAt: z.instanceof(Timestamp),
  updatedAt: z.instanceof(Timestamp)
});

export type List = z.infer<typeof ListItemSchema>;

export interface ListDisplay extends List {
  id: string;
  isOwner: boolean;
}

export interface RealtimeList {
  listId: string;
  collaborators: string[]; // Assuming sharedWith is an array of user IDs
  updatedAt: Timestamp; // Unix timestamp or Firebase Timestamp
}

export type ListCreateInput = {
  name: string;
  items: ListItem[];
  collaborators: string[];
};
