import { Module } from '@nestjs/common';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { TenantConnectionModule } from 'src/infra/database/tenant-connection.module';

@Module({
  imports: [TenantConnectionModule],
  controllers: [ClientController],
  providers: [ClientService],
  exports: [ClientService],
})
export class ClientModule {}
