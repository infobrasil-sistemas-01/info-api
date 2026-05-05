import { Module } from '@nestjs/common';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { InfraRegistryModule } from 'src/infra/prisma/infra-registry.module';

@Module({
  imports: [InfraRegistryModule],
  controllers: [PermissionController],
  providers: [PermissionService],
  exports: [PermissionService],
})
export class PermissionModule {}
