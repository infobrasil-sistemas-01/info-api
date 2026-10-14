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
import { PurchaseService } from './purchase.service';
import { PurchaseItemService } from './purchase-item.service';
import { PurchaseQueryDto } from './dto/purchase-query.dto';
import {
  PurchaseDetailResponseDto,
  PurchaseResponseDto,
} from './dto/purchase-response.dto';

@ApiTags('Purchase')
@Controller(['purchases', 'purchase'])
export class PurchaseController {
  constructor(
    private readonly purchaseService: PurchaseService,
    private readonly purchaseItemService: PurchaseItemService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions({ allOf: ['tenant.purchases.view'] })
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Listar compras / entradas de mercadorias',
    description:
      'Retorna uma lista paginada de entradas de notas fiscais e compras da tabela COMPRAS com dados do fornecedor.',
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
    description: 'Lista de compras/entradas retornada com sucesso.',
    type: [PurchaseResponseDto],
    headers: {
      'X-Total-Count': {
        description:
          'Total de registros encontrados considerando os filtros (presente quando X-Request-Count: true)',
        schema: { type: 'integer', example: 145 },
      },
      'X-Total-Pages': {
        description:
          'Total de páginas calculadas (presente quando X-Request-Count: true)',
        schema: { type: 'integer', example: 3 },
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
    @Query() query: PurchaseQueryDto,
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

    const sanitizedQuery: PurchaseQueryDto = {
      ...query,
      storeId: finalStoreId,
    };

    return this.purchaseService.get(credentialsId, sanitizedQuery, includeCount);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions({ allOf: ['tenant.purchases.view'] })
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obter detalhes de uma compra pelo ID',
    description:
      'Retorna os dados cadastrais, totais e impostos da compra com a lista de itens.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Número identificador da compra (COM_NUMERO)',
    example: 10452,
  })
  @ApiResponse({
    status: 200,
    description: 'Detalhes da compra retornados com sucesso.',
    type: PurchaseDetailResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Compra não encontrada.',
  })
  async getById(
    @Req() req: ReqWithAuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Query('storeId') queryStoreId?: number,
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
        : queryStoreId
          ? Number(queryStoreId)
          : storeIdToken;

    const purchase = await this.purchaseService.getById(
      credentialsId,
      finalStoreId,
      id,
    );

    if (!purchase) {
      throw new NotFoundException(`Compra ${id} não encontrada`);
    }

    const items = await this.purchaseItemService.findItemsByPurchaseId(
      credentialsId,
      id,
    );

    return {
      ...purchase,
      items,
    };
  }
}
