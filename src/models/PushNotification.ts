import { z } from 'zod';

const PushNotificationInputSchema = z.object({
  userId: z.string().min(1),
  title: z.string().min(1),
  body: z.string().min(1),
  data: z
    .record<z.ZodString>(z.string().min(1)) // Use z.record to define an object with string keys and values
    .optional()
});
export type PushNotificationInput = z.infer<typeof PushNotificationInputSchema>;

export type UserPushNotification = {
  userId: string;
  title: string;
  body: string;
  data?: object;
};

export type UsersPushNotification = {
  userIds: string[];
  title: string;
  body: string;
  data?: object;
};

export type TokenPushNotification = {
  token: string;
  title: string;
  body: string;
  data?: object;
};
