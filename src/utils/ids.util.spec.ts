import { ids } from './ids.util';

describe('IdsUtil', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('ids', () => {
    it('should return P98 env value when id is 98', () => {
      process.env.P98 = 'profile-98-value';
      jest.resetModules();
      const { ids } = require('./ids.util');
      expect(ids(98)).toBe('profile-98-value');
    });

    it('should return P99 env value when id is 99', () => {
      process.env.P99 = 'profile-99-value';
      jest.resetModules();
      const { ids } = require('./ids.util');
      expect(ids(99)).toBe('profile-99-value');
    });

    it('should return P131 env value when id is 131', () => {
      process.env.P131 = 'profile-131-value';
      jest.resetModules();
      const { ids } = require('./ids.util');
      expect(ids(131)).toBe('profile-131-value');
    });

    it('should return P104 env value when id is 104', () => {
      process.env.P104 = 'profile-104-value';
      jest.resetModules();
      const { ids } = require('./ids.util');
      expect(ids(104)).toBe('profile-104-value');
    });

    it('should return P129 env value when id is 129', () => {
      process.env.P129 = 'profile-129-value';
      jest.resetModules();
      const { ids } = require('./ids.util');
      expect(ids(129)).toBe('profile-129-value');
    });

    it('should return P130 env value when id is 130', () => {
      process.env.P130 = 'profile-130-value';
      jest.resetModules();
      const { ids } = require('./ids.util');
      expect(ids(130)).toBe('profile-130-value');
    });

    it('should return undefined for unknown id', () => {
      jest.resetModules();
      const { ids } = require('./ids.util');
      expect(ids(999)).toBeUndefined();
    });

    it('should return undefined when env var is not set', () => {
      delete process.env.P98;
      jest.resetModules();
      const { ids } = require('./ids.util');
      expect(ids(98)).toBeUndefined();
    });
  });
});
