import { ZodDto } from 'src/common/validation/zod-dto';
import { z } from 'zod';

export const CreateDbCredentialsSchema = z.object({
  host: z.string().min(1).max(255, 'Host não pode ultrapassar 255 caracteres'),
  port: z.number().int().positive(),
  database: z
    .string()
    .min(1)
    .max(255, 'Database não pode ultrapassar 255 caracteres'),
  user: z
    .string()
    .min(1)
    .max(255, 'Usuário não pode ultrapassar 255 caracteres'),
  dbId: z.number().int().positive(),
});

export class CreateDbCredentialsDto extends ZodDto(CreateDbCredentialsSchema) {}

export const UpdateDbCredentialsSchema = CreateDbCredentialsSchema.partial();
export class UpdateDbCredentialsDto extends ZodDto(UpdateDbCredentialsSchema) {}
