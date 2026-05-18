import { Module } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { DeliveryController } from './delivery.controller';
import { TenantConnectionModule } from 'src/infra/database/tenant-connection.module';

@Module({
  controllers: [DeliveryController],
  imports: [TenantConnectionModule],
  providers: [DeliveryService],
  exports: [DeliveryService],
})
export class DeliveryModule { }
