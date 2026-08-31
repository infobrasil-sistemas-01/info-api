import { Module } from '@nestjs/common';
import { FiscalEntryController } from './fiscal-entry.controller';
import { FiscalEntryService } from './fiscal-entry.service';
import { TenantConnectionModule } from 'src/infra/database/tenant-connection.module';

@Module({
  imports: [TenantConnectionModule],
  controllers: [FiscalEntryController],
  providers: [FiscalEntryService],
  exports: [FiscalEntryService],
})
export class FiscalEntryModule {}
