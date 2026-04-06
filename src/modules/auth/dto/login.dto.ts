import z, { email } from 'zod';

export const loginSchema = z.object({
  email: z.email,
  password: z.string().min(6),
});

export class LoginDto {
  static schema = loginSchema;

  basic!: string;
}
