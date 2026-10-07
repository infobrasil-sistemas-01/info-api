import { ZodDto } from 'src/common/validation/zod-dto';
import { z } from 'zod';

export const CreateUserSchema = z.object({
  user: z.string().min(3).max(78, 'Usuário não pode ultrapassar 78 caracteres'),
  email: z
    .email('E-mail inválido')
    .max(255, 'E-mail não pode ultrapassar 255 caracteres')
    .optional()
    .nullable(),
  password: z
    .string()
    .min(6)
    .max(255, 'Senha não pode ultrapassar 255 caracteres')
    .optional()
    .nullable(),
  status: z.boolean().default(true),
  dbCredentialsId: z.uuid(),
  storeId: z.number().int().default(1),
  roleId: z.uuid().optional().nullable(),
  planId: z.uuid().optional().nullable(),
});

export class CreateUserDto extends ZodDto(CreateUserSchema) {}

export const UpdateUserSchema = CreateUserSchema.partial();

export class UpdateUserDto extends ZodDto(UpdateUserSchema) {}
