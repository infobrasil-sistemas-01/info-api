import { OperatorVerifyDto, OperatorVerifySchema } from './operator-verify.dto';

describe('OperatorVerifyDto', () => {
  describe('OperatorVerifySchema', () => {
    it('should validate correct payload', () => {
      const result = OperatorVerifySchema.safeParse({
        username: 'OPERADOR1',
        password: 'secretpassword',
      });
      expect(result.success).toBe(true);
    });

    it('should reject missing username', () => {
      const result = OperatorVerifySchema.safeParse({
        password: 'secretpassword',
      });
      expect(result.success).toBe(false);
    });

    it('should reject empty username', () => {
      const result = OperatorVerifySchema.safeParse({
        username: '',
        password: 'secretpassword',
      });
      expect(result.success).toBe(false);
    });

    it('should reject missing password', () => {
      const result = OperatorVerifySchema.safeParse({
        username: 'OPERADOR1',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('OperatorVerifyDto class', () => {
    it('should have correct schema reference', () => {
      expect(OperatorVerifyDto.schema).toBe(OperatorVerifySchema);
    });
  });
});
