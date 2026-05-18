import z from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(6),
});

export class LoginDto {
  static schema = loginSchema;
  basic!: string;
}
