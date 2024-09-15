import { Timestamp } from '@react-native-firebase/firestore';
import { z } from 'zod';

export const InvitationFormSchema = z.object({
  recipient: z.string().email(),
  message: z.string().optional()
});

export type InvitationFormData = z.infer<typeof InvitationFormSchema>;

export const InvitationInputSchema = z.object({
  senderId: z.string(),
  senderName: z.string(),
  recipientId: z.string(),
  message: z.string().optional()
});

export type InvitationInput = z.infer<typeof InvitationInputSchema>;

export const InvitationSchema = z.object({
  id: z.string(),
  senderId: z.string(),
  senderName: z.string(),
  recipientId: z.string(),
  status: z.enum(['pending', 'accepted', 'rejected']),
  message: z.string().optional(),
  createdAt: z.instanceof(Timestamp),
  isOwner: z.boolean().optional()
});

export type Invitation = z.infer<typeof InvitationSchema>;
