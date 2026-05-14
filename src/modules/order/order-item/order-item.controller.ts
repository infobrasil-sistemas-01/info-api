import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, type ReqWithAuthContext } from 'src/modules/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/infra/rbac/permissions.guard';
import { RequirePermissions } from 'src/infra/rbac/permissions.decorator';
import { OrderItemService } from './order-item.service';
import { GetOrderItemsQueryDto } from './dto/order-item-query.dto';
import { OrderItemEnrichedResponseDto } from './dto/order-item-response.dto';

@ApiTags('Order Items')
@ApiBearerAuth()
@Controller('order-items')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) { }

  @Get()
  @RequirePermissions({ allOf: ['tenant.orders.view'] })
  @ApiOperation({
    summary: 'Listar itens de pedidos',
    description: 'Retorna uma lista de itens de pedidos com informações de marca e grupo.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de itens retornada com sucesso.',
    type: [OrderItemEnrichedResponseDto],
  })
  async get(
    @Req() req: ReqWithAuthContext,
    @Query() query: GetOrderItemsQueryDto,
  ) {
    const { credentialsId, storeId } = req.authContext || {};

    if (!credentialsId) {
      throw new Error('Credentials ID not found in token');
    }

    if (!storeId) {
      throw new Error('Store ID not found in token');
    }

    return this.orderItemService.get(credentialsId, storeId, query);
  }
}
