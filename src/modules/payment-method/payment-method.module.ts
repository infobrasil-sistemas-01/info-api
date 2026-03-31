import { Module } from '@nestjs/common';
import { PaymentMethodController } from './payment-method.controller';
import { PaymentMethodService } from './payment-method.service';
import { TenantConnectionModule } from 'src/infra/database/tenant-connection.module';

@Module({
  controllers: [PaymentMethodController],
  imports: [TenantConnectionModule],
  providers: [PaymentMethodService],
})
export class PaymentMethodModule {}
