import { Module } from '@nestjs/common';
import { AccountPayableController } from './account-payable.controller';
import { AccountPayableService } from './account-payable.service';
import { TenantConnectionModule } from 'src/infra/database/tenant-connection.module';

@Module({
  controllers: [AccountPayableController],
  imports: [TenantConnectionModule],
  providers: [AccountPayableService],
})
export class AccountPayableModule { }
