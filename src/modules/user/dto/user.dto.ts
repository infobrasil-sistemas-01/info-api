import { z } from 'zod';

export const CreateUserSchema = z.object({
  user: z.string().min(3).max(78),
  email: z.email('E-mail inválido').optional().nullable(),
  password: z.string().min(6).max(255).optional().nullable(),
  status: z.boolean().default(true),
  dbCredentialsId: z.uuid(),
  storeId: z.number().int().default(1),
  roleId: z.uuid().optional().nullable(),
  planId: z.uuid().optional().nullable(),
});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;

export const UpdateUserSchema = CreateUserSchema.partial();

export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;