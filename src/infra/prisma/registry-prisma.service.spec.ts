import { RegistryPrismaService } from './registry-prisma.service';
import { EnvService } from 'src/config/env/env.service';

describe('RegistryPrismaService', () => {
  describe('creation', () => {
    it('should extend PrismaClient', () => {
      expect(RegistryPrismaService.prototype).toBeInstanceOf(Object);
    });
  });
});
