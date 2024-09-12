import { ListItem, ListItemSchema } from '@/models/ListItem';
import { Timestamp } from 'firebase/firestore';
import { z } from 'zod';

export const ListSchema = z.object({
  name: z.string(),
  ownerId: z.string(),
  items: z.array(ListItemSchema),
  collaborators: z.array(z.string()),
  modifiedBy: z.string().nullable(),
  createdAt: z.instanceof(Timestamp),
  updatedAt: z.instanceof(Timestamp)
});

export type List = z.infer<typeof ListSchema>;

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
