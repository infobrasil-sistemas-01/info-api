import { Module } from '@nestjs/common';
import { CallCenterController } from './call-center.controller';
import { CallCenterService } from './call-center.service';
import { TenantConnectionModule } from 'src/infra/database/tenant-connection.module';

@Module({
  imports: [TenantConnectionModule],
  controllers: [CallCenterController],
  providers: [CallCenterService],
  exports: [CallCenterService],
})
export class CallCenterModule {}
