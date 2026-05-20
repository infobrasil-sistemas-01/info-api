import { Module } from '@nestjs/common';
import { StatusController } from './status.controller';
import { StatusService } from './status.service';
import { InfraRegistryModule } from 'src/infra/prisma/infra-registry.module';
import { HealthModule } from '../health/health.module';

@Module({
  imports: [InfraRegistryModule, HealthModule],
  controllers: [StatusController],
  providers: [StatusService],
  exports: [StatusService],
})
export class StatusModule {}
