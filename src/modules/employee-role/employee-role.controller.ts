import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/infra/rbac/permissions.guard';
import { RequirePermissions } from 'src/infra/rbac/permissions.decorator';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { EmployeeRoleService } from './employee-role.service';
import { GetEmployeeRolesQueryDto } from './dto/get-employee-roles-query.dto';
import { EmployeeRoleResponseDto } from './dto/employee-role-response.dto';

@ApiTags('Employee')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('employee-roles')
export class EmployeeRoleController {
  constructor(private readonly employeeRoleService: EmployeeRoleService) { }

  @Get()
  @RequirePermissions({ allOf: ['tenant.employees.view'] })
  @ApiOperation({ summary: 'Listar funções/cargos de funcionários' })
  @ApiResponse({
    status: 200,
    description: 'Lista de funções/cargos de funcionários',
    type: [EmployeeRoleResponseDto],
  })
  async get(
    @CurrentUser() user: any,
    @Query() query: GetEmployeeRolesQueryDto,
  ) {
    return this.employeeRoleService.get(
      user.credentials_id,
      query.page,
      query.pageSize,
      query.search,
    );
  }
}
