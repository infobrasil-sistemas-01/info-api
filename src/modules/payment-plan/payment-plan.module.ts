import { Module } from '@nestjs/common';
import { PaymentPlanController } from './payment-plan.controller';
import { PaymentPlanService } from './payment-plan.service';
import { TenantConnectionModule } from 'src/infra/database/tenant-connection.module';

@Module({
  controllers: [PaymentPlanController],
  imports: [TenantConnectionModule],
  providers: [PaymentPlanService],
})
export class PaymentPlanModule {}
