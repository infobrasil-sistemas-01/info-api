import { Module } from '@nestjs/common';
import { InfraRegistryModule } from '../prisma/infra-registry.module';
import { FirebirdModule } from '../firebird/firebird.module';
import { TenantConnectionService } from './tenant-connection.service';

@Module({
  imports: [InfraRegistryModule, FirebirdModule],
  providers: [TenantConnectionService],
  exports: [TenantConnectionService],
})
export class TenantConnectionModule {}
