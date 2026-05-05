import { z } from 'zod';

export const CreateUserSchema = z.object({
  user: z.string().min(3).max(78),
  password: z.string().min(6).max(255),
  status: z.boolean().default(true),
  dbCredentialsId: z.string().uuid(),
  storeId: z.number().int().default(1),
  roleId: z.string().uuid().optional().nullable(),
});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;

export const UpdateUserSchema = CreateUserSchema.partial().extend({
  password: z.string().min(6).max(255).optional(),
});

export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;