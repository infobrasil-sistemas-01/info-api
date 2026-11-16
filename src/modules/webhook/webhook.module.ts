import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { InfraRegistryModule } from 'src/infra/prisma/infra-registry.module';
import { TenantConnectionModule } from 'src/infra/database/tenant-connection.module';

@Module({
  imports: [InfraRegistryModule, TenantConnectionModule],
  controllers: [WebhookController],
  providers: [WebhookService],
  exports: [WebhookService],
})
export class WebhookModule {}
