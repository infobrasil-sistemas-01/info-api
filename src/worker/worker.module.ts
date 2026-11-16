import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InfraRegistryModule } from 'src/infra/prisma/infra-registry.module';
import { TenantConnectionModule } from 'src/infra/database/tenant-connection.module';
import { WebhookWorkerService } from './webhook-worker.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    InfraRegistryModule,
    TenantConnectionModule,
  ],
  providers: [WebhookWorkerService],
})
export class WorkerModule {}
