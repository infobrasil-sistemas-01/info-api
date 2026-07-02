import { Module } from '@nestjs/common';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { TenantConnectionModule } from 'src/infra/database/tenant-connection.module';

@Module({
  controllers: [StoreController],
  imports: [TenantConnectionModule],
  providers: [StoreService],
})
export class StoreModule {}
