import { Module } from '@nestjs/common';
import { EmployeeRoleService } from './employee-role.service';
import { EmployeeRoleController } from './employee-role.controller';
import { TenantConnectionModule } from 'src/infra/database/tenant-connection.module';

@Module({
  controllers: [EmployeeRoleController],
  imports: [TenantConnectionModule],
  providers: [EmployeeRoleService],
  exports: [EmployeeRoleService],
})
export class EmployeeRoleModule { }
