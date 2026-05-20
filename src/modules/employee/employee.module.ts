import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { TenantConnectionModule } from 'src/infra/database/tenant-connection.module';

@Module({
  controllers: [EmployeeController],
  imports: [TenantConnectionModule],
  providers: [EmployeeService],
  exports: [EmployeeService],
})
export class EmployeeModule {}
