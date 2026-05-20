import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/infra/rbac/permissions.guard';
import { RequirePermissions } from 'src/infra/rbac/permissions.decorator';
import { SupplierService } from './supplier.service';
import { GetSuppliersQueryDto } from './dto/get-suppliers-query.dto';
import {
  SupplierResponseDto,
  SupplierDetailResponseDto,
} from './dto/supplier-response.dto';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';

@ApiTags('Supplier')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('suppliers')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Get()
  @RequirePermissions({ allOf: ['tenant.suppliers.view'] })
  @ApiOperation({ summary: 'Listar fornecedores' })
  @ApiResponse({
    status: 200,
    description: 'Lista de fornecedores',
    type: [SupplierResponseDto],
  })
  async get(@CurrentUser() user: any, @Query() query: GetSuppliersQueryDto) {
    return this.supplierService.get(
      user.credentials_id,
      query.storeId,
      query.page,
      query.pageSize,
      query.search,
      query.situation,
    );
  }

  @Get(':id')
  @RequirePermissions({ allOf: ['tenant.suppliers.view'] })
  @ApiOperation({ summary: 'Obter detalhe do fornecedor' })
  @ApiParam({
    name: 'id',
    description: 'ID do fornecedor (CRE_CODIGO)',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Detalhes do fornecedor',
    type: SupplierDetailResponseDto,
  })
  async getById(@CurrentUser() user: any, @Param('id') id: number) {
    return this.supplierService.getById(user.credentials_id, id);
  }
}
