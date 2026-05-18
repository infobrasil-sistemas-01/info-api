import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/infra/rbac/permissions.guard';
import { RequirePermissions } from 'src/infra/rbac/permissions.decorator';
import { EmployeeService } from './employee.service';
import { GetEmployeesQueryDto } from './dto/get-employees-query.dto';
import { EmployeeResponseDto, EmployeeDetailResponseDto } from './dto/employee-response.dto';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';

@ApiTags('Employee')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) { }

  @Get()
  @RequirePermissions({ allOf: ['tenant.employees.view'] })
  @ApiOperation({ summary: 'Listar funcionários' })
  @ApiResponse({ status: 200, description: 'Lista de funcionários', type: [EmployeeResponseDto] })
  async get(
    @CurrentUser() user: any,
    @Query() query: GetEmployeesQueryDto,
  ) {
    return this.employeeService.get(
      user.credentials_id,
      query.storeId,
      query.page,
      query.pageSize,
      query.search,
      query.situation,
      query.functionId,
    );
  }

  @Get(':id')
  @RequirePermissions({ allOf: ['tenant.employees.view'] })
  @ApiOperation({ summary: 'Obter detalhe do funcionário' })
  @ApiParam({ name: 'id', description: 'ID do funcionário (FUN_CODIGO)', example: 1 })
  @ApiResponse({ status: 200, description: 'Detalhes do funcionário', type: EmployeeDetailResponseDto })
  async getById(
    @CurrentUser() user: any,
    @Param('id') id: number,
  ) {
    return this.employeeService.getById(user.credentials_id, id);
  }
}
