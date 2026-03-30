import { Module } from '@nestjs/common';
import { RegistryPrismaService } from './registry-prisma.service';

@Module({
  providers: [RegistryPrismaService],
  exports: [RegistryPrismaService],
})
export class InfraRegistryModule {}
