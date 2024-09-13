import { FileAssetSchema } from '@/models/FileAsset';
import { Timestamp } from 'firebase/firestore';
import { z } from 'zod';

export enum UserRole {
  buyer = 'buyer',
  requester = 'requester',
  both = 'both'
}

const ProfileSchema = z.object({
  id: z.string(),
  uid: z.string(),
  username: z.string(),
  email: z.string(),
  picture: FileAssetSchema.nullable(),
  collaborators: z.array(z.string()),
  role: z.nativeEnum(UserRole),
  createdAt: z.instanceof(Timestamp),
  updatedAt: z.instanceof(Timestamp)
});

export type Profile = z.infer<typeof ProfileSchema>;

export type ProfileCreateInput = Pick<
  Profile,
  'username' | 'email' | 'picture'
>;
