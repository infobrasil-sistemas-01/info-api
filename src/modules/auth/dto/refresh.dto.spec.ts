import { RefreshDto, RefreshTokenDto } from './refresh.dto';

describe('RefreshDto', () => {
  describe('RefreshTokenDto schema', () => {
    test.each([
      ['valid token', { refresh_token: 'some-valid-token' }],
      ['empty string', { refresh_token: '' }],
    ])('should accept %s', (_, input) => {
      expect(() => RefreshTokenDto.parse(input)).not.toThrow();
    });

    test.each([
      ['missing refresh_token', {}],
      ['non-string token', { refresh_token: 12345 }],
    ])('should reject %s', (_, input) => {
      expect(() => RefreshTokenDto.parse(input)).toThrow();
    });
  });

  describe('RefreshDto class', () => {
    it('should have static schema property', () => {
      expect(RefreshDto.schema).toBe(RefreshTokenDto);
    });

    it('should create instance with valid token', () => {
      const dto = new RefreshDto();
      dto.refresh_token = 'valid-token';
      expect(dto.refresh_token).toBe('valid-token');
    });
  });
});
