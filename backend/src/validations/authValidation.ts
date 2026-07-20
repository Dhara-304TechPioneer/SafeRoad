import { z } from 'zod';

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, 'Full name must be at least 2 characters')
      .max(100)
      .optional(),
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(100)
      .optional(),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .max(100),
  })
  .refine((data) => data.fullName || data.name, {
    message: 'Either fullName or name must be provided',
    path: ['fullName'],
  });

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
