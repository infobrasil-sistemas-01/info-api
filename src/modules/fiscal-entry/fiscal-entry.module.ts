import { Module } from '@nestjs/common';
import { FiscalEntryController } from './fiscal-entry.controller';
import { FiscalEntryService } from './fiscal-entry.service';

@Module({
  controllers: [FiscalEntryController],
  providers: [FiscalEntryService],
  exports: [FiscalEntryService],
})
export class FiscalEntryModule {}
