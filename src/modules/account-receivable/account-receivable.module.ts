import { Module } from '@nestjs/common';
import { AccountReceivableService } from './account-receivable.service';
import { AccountReceivableController } from './account-receivable.controller';
import { TenantConnectionModule } from 'src/infra/database/tenant-connection.module';

@Module({
  providers: [AccountReceivableService],
  controllers: [AccountReceivableController],
  imports: [TenantConnectionModule],
})
export class AccountReceivableModule {}
