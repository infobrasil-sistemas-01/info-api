import { CreateUserDto, CreateUserSchema, UpdateUserSchema } from './user.dto';

describe('UserDto', () => {
  const validData = {
    user: 'gabriel.bezerra',
    email: 'gabriel@infobrasilsistemas.com.br',
    password: 'securePassword123',
    status: true,
    dbCredentialsId: '11111111-1111-4111-8111-111111111111',
    storeId: 1,
    roleId: '22222222-2222-4222-8222-222222222222',
    planId: '33333333-3333-4333-8333-333333333333',
  };

  describe('CreateUserSchema', () => {
    it('should validate valid user payload', () => {
      const result = CreateUserSchema.parse(validData);
      expect(result.user).toBe(validData.user);
    });

    it('should accept username with exactly 78 characters', () => {
      const longUser = 'u'.repeat(78);
      expect(() =>
        CreateUserSchema.parse({
          ...validData,
          user: longUser,
        }),
      ).not.toThrow();
    });

    it('should reject username longer than 78 characters', () => {
      const tooLongUser = 'u'.repeat(79);
      expect(() =>
        CreateUserSchema.parse({
          ...validData,
          user: tooLongUser,
        }),
      ).toThrow();
    });

    it('should accept password with exactly 255 characters', () => {
      const longPassword = 'p'.repeat(255);
      expect(() =>
        CreateUserSchema.parse({
          ...validData,
          password: longPassword,
        }),
      ).not.toThrow();
    });

    it('should reject password longer than 255 characters', () => {
      const tooLongPassword = 'p'.repeat(256);
      expect(() =>
        CreateUserSchema.parse({
          ...validData,
          password: tooLongPassword,
        }),
      ).toThrow();
    });

    it('should reject email longer than 255 characters', () => {
      const longEmailPrefix = 'a'.repeat(245);
      const email257 = `${longEmailPrefix}@example.com`;
      expect(email257.length).toBeGreaterThan(255);
      expect(() =>
        CreateUserSchema.parse({
          ...validData,
          email: email257,
        }),
      ).toThrow();
    });
  });

  describe('CreateUserDto class', () => {
    it('should define static schema property', () => {
      expect(CreateUserDto.schema).toBe(CreateUserSchema);
    });
  });
});
