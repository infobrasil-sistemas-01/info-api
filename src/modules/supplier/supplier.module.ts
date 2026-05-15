import { Module } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { TenantConnectionModule } from 'src/infra/database/tenant-connection.module';

@Module({
  controllers: [SupplierController],
  imports: [TenantConnectionModule],
  providers: [SupplierService],
  exports: [SupplierService],
})
export class SupplierModule {}
