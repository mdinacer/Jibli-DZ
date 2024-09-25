import { z } from 'zod';

export const SignUpFormSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(20, 'Password must be at most 20 characters')
  // confirmPassword: z
  //   .string()
  //   .min(6, 'Password must be at least 6 characters')
  //   .max(20, 'Password must be at most 20 characters')
});
// .refine((data) => data.password === data.confirmPassword, {
//   path: ['confirmPassword'],
//   message: 'Passwords do not match'
// });

export type SignUpFormData = z.infer<typeof SignUpFormSchema>;
