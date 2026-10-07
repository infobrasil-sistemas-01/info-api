import z from 'zod';

export const loginSchema = z.object({
  username: z
    .string()
    .min(1)
    .max(78, 'Usuário não pode ultrapassar 78 caracteres'),
  password: z
    .string()
    .min(6)
    .max(255, 'Senha não pode ultrapassar 255 caracteres'),
});

export class LoginDto {
  static schema = loginSchema;
  basic!: string;
}
