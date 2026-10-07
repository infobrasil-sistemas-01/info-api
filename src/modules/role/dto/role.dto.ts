import { ZodDto } from 'src/common/validation/zod-dto';
import { z } from 'zod';

export const CreateRoleSchema = z.object({
  name: z
    .string()
    .min(3)
    .max(50, 'Nome da role não pode ultrapassar 50 caracteres'),
  description: z
    .string()
    .max(255, 'Descrição não pode ultrapassar 255 caracteres')
    .optional(),
  permissions: z.array(z.string()).optional(),
});

export class CreateRoleDto extends ZodDto(CreateRoleSchema) {}

export const UpdateRoleSchema = CreateRoleSchema.partial();
export class UpdateRoleDto extends ZodDto(UpdateRoleSchema) {}
