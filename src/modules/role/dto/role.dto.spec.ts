import { CreateRoleDto, CreateRoleSchema, UpdateRoleSchema } from './role.dto';

describe('RoleDto', () => {
  const validData = {
    name: 'Operador Financeiro',
    description: 'Acesso às rotas financeiras e relatórios',
    permissions: ['core.order.view'],
  };

  describe('CreateRoleSchema', () => {
    it('should validate valid role payload', () => {
      const result = CreateRoleSchema.parse(validData);
      expect(result.name).toBe(validData.name);
    });

    it('should accept name with exactly 50 characters', () => {
      const name50 = 'n'.repeat(50);
      expect(() =>
        CreateRoleSchema.parse({
          ...validData,
          name: name50,
        }),
      ).not.toThrow();
    });

    it('should reject name longer than 50 characters', () => {
      const name51 = 'n'.repeat(51);
      expect(() =>
        CreateRoleSchema.parse({
          ...validData,
          name: name51,
        }),
      ).toThrow();
    });

    it('should accept description with exactly 255 characters', () => {
      const desc255 = 'd'.repeat(255);
      expect(() =>
        CreateRoleSchema.parse({
          ...validData,
          description: desc255,
        }),
      ).not.toThrow();
    });

    it('should reject description longer than 255 characters', () => {
      const desc256 = 'd'.repeat(256);
      expect(() =>
        CreateRoleSchema.parse({
          ...validData,
          description: desc256,
        }),
      ).toThrow();
    });
  });

  describe('CreateRoleDto class', () => {
    it('should define static schema property', () => {
      expect(CreateRoleDto.schema).toBe(CreateRoleSchema);
    });
  });
});
