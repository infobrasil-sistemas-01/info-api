import { Module } from '@nestjs/common';
import { TenantConnectionModule } from 'src/infra/database/tenant-connection.module';
import { AdjustmentController } from './adjustment.controller';
import { AdjustmentService } from './adjustment.service';

@Module({
  imports: [TenantConnectionModule],
  controllers: [AdjustmentController],
  providers: [AdjustmentService],
  exports: [AdjustmentService],
})
export class AdjustmentModule {}
