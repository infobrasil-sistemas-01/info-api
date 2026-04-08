import { loginSchema } from './login.dto';

describe('LoginDto', () => {
  describe('loginSchema', () => {
    test.each([
      [
        'schema is defined',
        () => {
          expect(loginSchema).toBeDefined();
        },
      ],
    ])('%s', (_, fn) => fn());

    test.each([
      [
        'valid email and password',
        { email: 'user@example.com', password: 'password123' },
      ],
      [
        'password with 6 chars',
        { email: 'user@example.com', password: '123456' },
      ],
      ['missing email', { password: 'password123' }],
      ['missing password', { email: 'user@example.com' }],
      ['empty object', {}],
    ])(
      'should throw when parsing %s (schema has invalid z.email)',
      (_, input) => {
        expect(() => loginSchema.parse(input)).toThrow();
      },
    );
  });

  describe('LoginDto class', () => {
    it('should have static schema property', () => {
      expect(LoginDto.schema).toBe(loginSchema);
    });
  });
});

class LoginDto {
  static schema = loginSchema;
  basic!: string;
}
