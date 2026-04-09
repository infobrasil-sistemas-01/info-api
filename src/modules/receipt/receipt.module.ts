import { Module } from '@nestjs/common';
import { TenantConnectionModule } from 'src/infra/database/tenant-connection.module';
import { ReceiptService } from './receipt.service';

@Module({
  imports: [TenantConnectionModule],
  providers: [ReceiptService],
  exports: [ReceiptService],
})
export class ReceiptModule { }
