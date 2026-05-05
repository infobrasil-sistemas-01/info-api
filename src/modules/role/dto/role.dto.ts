import { z } from 'zod';

export const CreateRoleSchema = z.object({
  name: z.string().min(3).max(50),
  description: z.string().max(255).optional(),
  permissions: z.array(z.string()).optional(), // Array of permission IDs or keys? IDs are safer for sync.
});

export type CreateRoleDto = z.infer<typeof CreateRoleSchema>;

export const UpdateRoleSchema = CreateRoleSchema.partial();
export type UpdateRoleDto = z.infer<typeof UpdateRoleSchema>;
