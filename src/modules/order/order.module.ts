import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { TenantConnectionModule } from 'src/infra/database/tenant-connection.module';
import { OrderService } from './order.service';
import { ProductModule } from '../product/product.module';
import { OrderItemService } from './order-item/order-item.service';

@Module({
  controllers: [OrderController],
  imports: [TenantConnectionModule, ProductModule],
  providers: [OrderService, OrderItemService],
})
export class OrderModule {}
