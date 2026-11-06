import { Module } from '@nestjs/common';
import { TenantConnectionModule } from 'src/infra/database/tenant-connection.module';
import { ProductionOrderController } from './production-order.controller';
import { ProductionOrderService } from './production-order.service';

@Module({
  imports: [TenantConnectionModule],
  controllers: [ProductionOrderController],
  providers: [ProductionOrderService],
  exports: [ProductionOrderService],
})
export class ProductionOrderModule {}

