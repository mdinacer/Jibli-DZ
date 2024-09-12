import { z } from 'zod';

export const FileAssetSchema = z.object({
  fileName: z.string(),
  fileUrl: z.string()
});

export type FileAsset = z.infer<typeof FileAssetSchema>;
