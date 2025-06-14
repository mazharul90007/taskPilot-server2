import { z } from 'zod';

// Create user validation schema
export const createUserValidation = z.object({
  userId: z.string().min(1, 'User ID is required'),
  userName: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'leader', 'member']).default('member')
});

// Type for the validated input
export type CreateUserInput = z.infer<typeof createUserValidation>;
// export const CreateUserInput = {createUserValidation};
