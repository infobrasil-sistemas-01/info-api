import { Module } from '@nestjs/common';
import { PermissionResolver } from './permission-resolver.service';
import { RbacContextService } from './rbac-context.service';
import { PermissionsGuard } from './permissions.guard';
import { InfraRegistryModule } from '../registry/infra-registry.module';

@Module({
  imports: [InfraRegistryModule],
  providers: [PermissionResolver, RbacContextService, PermissionsGuard],
  exports: [PermissionResolver, RbacContextService, PermissionsGuard],
})
export class RbacModule {}
