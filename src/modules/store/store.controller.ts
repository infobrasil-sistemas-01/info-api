import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { ReqWithAuthContext } from '../auth/guards/jwt-auth.guard';
import { StoreService } from './store.service';
import { PermissionsGuard } from 'src/infra/rbac/permissions.guard';
import { RequirePermissions } from 'src/infra/rbac/permissions.decorator';
import { StoreResponseDto } from './dto/store-response.dto';

import { GetStoresQueryDto } from './dto/get-stores-query.dto';

@ApiTags('Store')
@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions({ allOf: ['tenant.stores.view'] })
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Listar lojas',
    description:
      'Retorna uma lista paginada de lojas associadas às credenciais do usuário autenticado, com suporte a filtros por código e CNPJ.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de lojas retornada com sucesso.',
    type: [StoreResponseDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Erro de requisição, como pageSize excedendo o limite.',
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticação inválido ou ausente.',
  })
  get(
    @Req() req: ReqWithAuthContext,
    @Query() query: GetStoresQueryDto,
  ) {
    const credentialsId = req.authContext?.credentialsId;

    if (!credentialsId) {
      throw new Error('Credentials ID not found in token');
    }

    return this.storeService.get(
      credentialsId,
      query.page ? Number(query.page) : undefined,
      query.pageSize ? Number(query.pageSize) : undefined,
      query.storeId ? Number(query.storeId) : undefined,
      query.storeCnpj,
    );
  }
}
