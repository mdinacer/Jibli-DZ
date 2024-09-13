import { FileAssetSchema } from '@/models/FileAsset';
import { z } from 'zod';

export const OnboardingProfileSchema = z
  .object({
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(20, 'Username must be at most 20 characters'),

    listName: z.string().optional(),
    picture: FileAssetSchema.nullable(),
    createList: z.boolean().default(false)
  })
  .refine(
    (data) =>
      data.createList === false ||
      (data.createList && data.listName && data.listName.trim() !== ''),
    {
      message: 'List name cannot be empty when creating a list',
      path: ['listName'] // Specify the path to show the error on the listName field
    }
  );

export type OnboardingProfileData = z.infer<typeof OnboardingProfileSchema>;
