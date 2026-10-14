import { Module } from '@nestjs/common';
import { PurchaseController } from './purchase.controller';
import { PurchaseService } from './purchase.service';
import { PurchaseItemController } from './purchase-item.controller';
import { PurchaseItemService } from './purchase-item.service';
import { TenantConnectionModule } from 'src/infra/database/tenant-connection.module';

@Module({
  imports: [TenantConnectionModule],
  controllers: [PurchaseController, PurchaseItemController],
  providers: [PurchaseService, PurchaseItemService],
  exports: [PurchaseService, PurchaseItemService],
})
export class PurchaseModule {}
