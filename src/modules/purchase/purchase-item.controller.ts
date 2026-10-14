import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { ReqWithAuthContext } from '../auth/guards/jwt-auth.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/infra/rbac/permissions.guard';
import { RequirePermissions } from 'src/infra/rbac/permissions.decorator';
import { IncludeCount } from 'src/common/decorators/include-count.decorator';
import { PurchaseItemService } from './purchase-item.service';
import { GetPurchaseItemsQueryDto } from './dto/purchase-item-query.dto';
import { PurchaseItemEnrichedResponseDto } from './dto/purchase-item-response.dto';

@ApiTags('Purchase Items')
@ApiBearerAuth()
@Controller('purchase-items')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PurchaseItemController {
  constructor(private readonly purchaseItemService: PurchaseItemService) {}

  @Get()
  @RequirePermissions({ allOf: ['tenant.purchases.view'] })
  @ApiOperation({
    summary: 'Listar itens de compras de mercadorias',
    description:
      'Retorna uma lista paginada e transversal de itens de compras (ITENSCOM) com informações enriquecidas de produto, marca e fornecedor.',
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
    description: 'Lista de itens de compra retornada com sucesso.',
    type: [PurchaseItemEnrichedResponseDto],
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
    @Query() query: GetPurchaseItemsQueryDto,
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

    const sanitizedQuery: GetPurchaseItemsQueryDto = {
      ...query,
      storeId: finalStoreId,
    };

    return this.purchaseItemService.get(
      credentialsId,
      sanitizedQuery,
      includeCount,
    );
  }
}
