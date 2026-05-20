import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { TenantConnectionModule } from 'src/infra/database/tenant-connection.module';
import { OrderService } from './order.service';
import { ProductModule } from '../product/product.module';
import { OrderItemService } from './order-item/order-item.service';
import { OrderItemController } from './order-item/order-item.controller';
import { ReceiptModule } from '../receipt/receipt.module';
import { RbacModule } from 'src/infra/rbac/rbac.module';

@Module({
  controllers: [OrderController, OrderItemController],
  imports: [TenantConnectionModule, ProductModule, ReceiptModule, RbacModule],
  providers: [OrderService, OrderItemService],
})
export class OrderModule {}
