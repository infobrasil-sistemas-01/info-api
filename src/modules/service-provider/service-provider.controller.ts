import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/infra/rbac/permissions.guard';
import { RequirePermissions } from 'src/infra/rbac/permissions.decorator';
import { ServiceProviderService } from './service-provider.service';
import { GetServiceProvidersQueryDto } from './dto/get-service-providers-query.dto';
import { ServiceProviderResponseDto, ServiceProviderDetailResponseDto } from './dto/service-provider-response.dto';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';

@ApiTags('Service Providers (Prestadores)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('service-providers')
export class ServiceProviderController {
  constructor(private readonly serviceProviderService: ServiceProviderService) { }

  @Get()
  @RequirePermissions({ allOf: ['tenant.service-providers.view'] })
  @ApiOperation({ summary: 'Listar prestadores de serviço' })
  @ApiResponse({ status: 200, description: 'Lista de prestadores de serviço', type: [ServiceProviderResponseDto] })
  async get(
    @CurrentUser() user: any,
    @Query() query: GetServiceProvidersQueryDto,
  ) {
    return this.serviceProviderService.get(
      user.credentials_id,
      query.storeId,
      query.page,
      query.pageSize,
      query.search,
      query.situation,
    );
  }

  @Get(':id')
  @RequirePermissions({ allOf: ['tenant.service-providers.view'] })
  @ApiOperation({ summary: 'Obter detalhe do prestador' })
  @ApiParam({ name: 'id', description: 'ID do prestador (PRE_CODIGO)', example: 1 })
  @ApiResponse({ status: 200, description: 'Detalhes do prestador de serviço', type: ServiceProviderDetailResponseDto })
  async getById(
    @CurrentUser() user: any,
    @Param('id') id: number,
  ) {
    return this.serviceProviderService.getById(user.credentials_id, id);
  }
}
