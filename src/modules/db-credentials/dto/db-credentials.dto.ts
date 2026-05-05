import { z } from 'zod';

export const CreateDbCredentialsSchema = z.object({
  host: z.string().min(1),
  port: z.number().int().positive(),
  database: z.string().min(1),
  user: z.string().min(1),
  dbId: z.number().int().positive(),
});

export type CreateDbCredentialsDto = z.infer<typeof CreateDbCredentialsSchema>;

export const UpdateDbCredentialsSchema = CreateDbCredentialsSchema.partial();

export type UpdateDbCredentialsDto = z.infer<typeof UpdateDbCredentialsSchema>;
