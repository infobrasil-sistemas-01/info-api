import { LoginDto, loginSchema } from './login.dto';

describe('LoginDto', () => {
  describe('loginSchema', () => {
    it('should be defined', () => {
      expect(loginSchema).toBeDefined();
    });

    it('should validate valid payload', () => {
      const result = loginSchema.parse({
        username: 'user',
        password: 'password123',
      });
      expect(result).toEqual({
        username: 'user',
        password: 'password123',
      });
    });

    it('should accept username with exactly 78 characters', () => {
      const longUsername = 'a'.repeat(78);
      expect(() =>
        loginSchema.parse({
          username: longUsername,
          password: 'password123',
        }),
      ).not.toThrow();
    });

    it('should reject username longer than 78 characters', () => {
      const tooLongUsername = 'a'.repeat(79);
      expect(() =>
        loginSchema.parse({
          username: tooLongUsername,
          password: 'password123',
        }),
      ).toThrow();
    });

    it('should accept password with exactly 255 characters', () => {
      const longPassword = 'p'.repeat(255);
      expect(() =>
        loginSchema.parse({
          username: 'user',
          password: longPassword,
        }),
      ).not.toThrow();
    });

    it('should reject password longer than 255 characters', () => {
      const tooLongPassword = 'p'.repeat(256);
      expect(() =>
        loginSchema.parse({
          username: 'user',
          password: tooLongPassword,
        }),
      ).toThrow();
    });
  });

  describe('LoginDto class', () => {
    it('should have static schema property', () => {
      expect(LoginDto.schema).toBe(loginSchema);
    });
  });
});
