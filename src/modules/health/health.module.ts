import { Module } from '@nestjs/common';
import { InfraRegistryModule } from 'src/infra/prisma/infra-registry.module';
import { TenantConnectionModule } from 'src/infra/database/tenant-connection.module';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

@Module({
  imports: [InfraRegistryModule, TenantConnectionModule],
  controllers: [HealthController],
  providers: [HealthService],
  exports: [HealthService],
})
export class HealthModule {}
