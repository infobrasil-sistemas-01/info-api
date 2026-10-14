import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/infra/rbac/permissions.guard';
import { RequirePermissions } from 'src/infra/rbac/permissions.decorator';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { CityService } from './city.service';
import { GetCitiesQueryDto } from './dto/get-cities-query.dto';
import { CityResponseDto } from './dto/city-response.dto';

@ApiTags('City')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('cities')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Get()
  @RequirePermissions({ allOf: ['tenant.cities.view'] })
  @ApiOperation({
    summary: 'Listar municípios',
    description:
      'Retorna a lista paginada de municípios do tenant, com suporte a busca textual por nome e filtro por estado (EST_CODIGO).',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de municípios retornada com sucesso.',
    type: [CityResponseDto],
  })
  async get(@CurrentUser() user: any, @Query() query: GetCitiesQueryDto) {
    return this.cityService.get(
      user.credentials_id,
      query.page,
      query.pageSize,
      query.search,
      query.stateId,
    );
  }
}
