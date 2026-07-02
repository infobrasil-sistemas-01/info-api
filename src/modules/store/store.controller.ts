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
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número de página para paginação',
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: Number,
    description: 'Número de itens por página',
  })
  @ApiQuery({
    name: 'storeId',
    required: false,
    type: Number,
    description: 'Código da loja para filtrar',
  })
  @ApiQuery({
    name: 'storeCnpj',
    required: false,
    type: String,
    description: 'CNPJ da loja para filtrar',
  })
  get(
    @Req() req: ReqWithAuthContext,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('storeId') storeId?: number,
    @Query('storeCnpj') storeCnpj?: string,
  ) {
    const credentialsId = req.authContext?.credentialsId;

    if (!credentialsId) {
      throw new Error('Credentials ID not found in token');
    }

    return this.storeService.get(
      credentialsId,
      page ? Number(page) : undefined,
      pageSize ? Number(pageSize) : undefined,
      storeId ? Number(storeId) : undefined,
      storeCnpj,
    );
  }
}
