import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InfraRegistryModule } from 'src/infra/prisma/infra-registry.module';
import { TenantConnectionModule } from 'src/infra/database/tenant-connection.module';
import { RbacModule } from 'src/infra/rbac/rbac.module';
import { EmailModule } from 'src/infra/email/email.module';
import { EnvModule } from 'src/config/env/env.module';
import { WebhookWorkerService } from './webhook-worker.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EnvModule,
    InfraRegistryModule,
    TenantConnectionModule,
    RbacModule,
    EmailModule,
  ],
  providers: [WebhookWorkerService],
})
export class WorkerModule {}
