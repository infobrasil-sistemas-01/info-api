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
  });

  describe('LoginDto class', () => {
    it('should have static schema property', () => {
      expect(LoginDto.schema).toBe(loginSchema);
    });
  });
});
