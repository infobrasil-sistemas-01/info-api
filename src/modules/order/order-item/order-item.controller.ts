import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  JwtAuthGuard,
  type ReqWithAuthContext,
} from 'src/modules/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/infra/rbac/permissions.guard';
import { RequirePermissions } from 'src/infra/rbac/permissions.decorator';
import { IncludeCount } from 'src/common/decorators/include-count.decorator';
import { OrderItemService } from './order-item.service';
import { GetOrderItemsQueryDto } from './dto/order-item-query.dto';
import { OrderItemEnrichedResponseDto } from './dto/order-item-response.dto';

@ApiTags('Order Items')
@ApiBearerAuth()
@Controller('order-items')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}

  @Get()
  @RequirePermissions({ allOf: ['tenant.orders.view'] })
  @ApiOperation({
    summary: 'Listar itens de pedidos',
    description:
      'Retorna uma lista de itens de pedidos com informações de marca e grupo.',
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
    description: 'Lista de itens retornada com sucesso.',
    type: [OrderItemEnrichedResponseDto],
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
        schema: { type: 'integer', example: 50 },
      },
    },
  })
  async get(
    @Req() req: ReqWithAuthContext,
    @Query() query: GetOrderItemsQueryDto,
    @IncludeCount() includeCount: boolean = false,
  ) {
    const { credentialsId, storeId } = req.authContext || {};

    if (!credentialsId) {
      throw new Error('Credentials ID not found in token');
    }

    if (!storeId) {
      throw new Error('Store ID not found in token');
    }

    return this.orderItemService.get(
      credentialsId,
      storeId,
      query,
      includeCount,
    );
  }
}
