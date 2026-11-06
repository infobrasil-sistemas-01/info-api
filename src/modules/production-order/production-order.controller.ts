import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { ReqWithAuthContext } from '../auth/guards/jwt-auth.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/infra/rbac/permissions.guard';
import { RequirePermissions } from 'src/infra/rbac/permissions.decorator';
import { IncludeCount } from 'src/common/decorators/include-count.decorator';
import { ProductionOrderService } from './production-order.service';
import {
  ProductionOrderQueryDto,
  GetProductionOrderByIdQueryDto,
} from './dto/production-order-query.dto';
import { ProductionOrderResponseDto } from './dto/production-order-response.dto';
import { ProductionOrderDetailResponseDto } from './dto/production-order-detail-response.dto';
import { ProductionOrderItemResponseDto } from './dto/production-order-item-response.dto';

@ApiTags('Production Order')
@Controller('production-order')
export class ProductionOrderController {
  constructor(
    private readonly productionOrderService: ProductionOrderService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions({ allOf: ['tenant.production-orders.view'] })
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Listar ordens de produção',
    description:
      'Retorna uma lista paginada de ordens de produção da tabela ORDENSPRODUCAO com informações de situação, loja, usuário e produto acabado.',
  })
  @ApiHeader({
    name: 'X-Request-Count',
    required: false,
    description:
      'Se definido como "true", calcula e retorna cabeçalhos de paginação (X-Total-Count, X-Total-Pages, X-Current-Page, X-Per-Page) na resposta.',
    schema: { type: 'string', example: 'true' },
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de ordens de produção retornada com sucesso.',
    type: [ProductionOrderResponseDto],
    headers: {
      'X-Total-Count': {
        description:
          'Total de registros encontrados considerando os filtros (presente quando X-Request-Count: true)',
        schema: { type: 'integer', example: 120 },
      },
      'X-Total-Pages': {
        description:
          'Total de páginas calculadas (presente quando X-Request-Count: true)',
        schema: { type: 'integer', example: 12 },
      },
      'X-Current-Page': {
        description:
          'Página atual solicitada (presente quando X-Request-Count: true)',
        schema: { type: 'integer', example: 1 },
      },
      'X-Per-Page': {
        description:
          'Quantidade de registros por página (presente quando X-Request-Count: true)',
        schema: { type: 'integer', example: 10 },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Parâmetros de busca inválidos.',
  })
  get(
    @Req() req: ReqWithAuthContext,
    @Query() query: ProductionOrderQueryDto,
    @IncludeCount() includeCount: boolean = false,
  ) {
    const {
      credentialsId,
      storeId: storeIdToken,
      type,
    } = req.authContext || {};

    if (!credentialsId) {
      throw new Error('Credentials ID not found in token');
    }

    const finalStoreId =
      type === 'H2M'
        ? storeIdToken
        : query.storeId
          ? Number(query.storeId)
          : storeIdToken;

    return this.productionOrderService.get(
      credentialsId,
      finalStoreId,
      query,
      includeCount,
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions({ allOf: ['tenant.production-orders.view'] })
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obter ordem de produção por ID com insumos',
    description:
      'Retorna os detalhes completos da ordem de produção e seu array aninhado de insumos/itens.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Número da ordem de produção (ORP_NUMERO)',
    example: 201,
  })
  @ApiResponse({
    status: 200,
    description:
      'Detalhes da ordem de produção com itens retornados com sucesso.',
    type: ProductionOrderDetailResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Ordem de produção não encontrada.',
  })
  async getById(
    @Req() req: ReqWithAuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Query() query: GetProductionOrderByIdQueryDto,
  ) {
    const {
      credentialsId,
      storeId: storeIdToken,
      type,
    } = req.authContext || {};

    if (!credentialsId) {
      throw new Error('Credentials ID not found in token');
    }

    const finalStoreId =
      type === 'H2M'
        ? storeIdToken
        : query.storeId
          ? Number(query.storeId)
          : storeIdToken;

    const orderData = await this.productionOrderService.getById(
      credentialsId,
      finalStoreId,
      id,
    );

    if (!orderData) {
      throw new NotFoundException(`Ordem de produção ${id} não encontrada`);
    }

    const items =
      await this.productionOrderService.getItemsByProductionOrderNumber(
        credentialsId,
        id,
      );

    return {
      ...orderData,
      items,
    };
  }

  @Get(':id/items')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions({ allOf: ['tenant.production-orders.view'] })
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Listar itens/insumos de uma ordem de produção',
    description:
      'Retorna diretamente o array de insumos consumidos vinculados a uma ordem de produção específica.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Número da ordem de produção (ORP_NUMERO)',
    example: 201,
  })
  @ApiResponse({
    status: 200,
    description: 'Itens da ordem de produção retornados com sucesso.',
    type: [ProductionOrderItemResponseDto],
  })
  async getItems(
    @Req() req: ReqWithAuthContext,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const credentialsId = req.authContext?.credentialsId;

    if (!credentialsId) {
      throw new Error('Credentials ID not found in token');
    }

    return this.productionOrderService.getItemsByProductionOrderNumber(
      credentialsId,
      id,
    );
  }
}

