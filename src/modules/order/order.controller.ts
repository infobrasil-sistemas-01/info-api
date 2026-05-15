import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { PostOrderDto } from './dto/create-order.dto';
import { OrderResponseDto, OrderDetailResponseDto } from './dto/order-response.dto';
import {
  JwtAuthGuard,
  type ReqWithAuthContext,
} from '../auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { OrderItemService } from './order-item/order-item.service';
import { GenerateReceiptDto } from './dto/generate-receipt.dto';
import { PermissionsGuard } from 'src/infra/rbac/permissions.guard';
import { RequirePermissions } from 'src/infra/rbac/permissions.decorator';

@Controller('orders')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly orderItemService: OrderItemService,
  ) { }

  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions({ allOf: ['tenant.orders.create'] })
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Criar um novo pedido',
    description:
      'Cria um novo pedido com os pedidos vendidos e informações de pagamento.',
  })
  @ApiResponse({
    status: 201,
    description: 'Pedido criado com sucesso.',
    schema: {
      type: 'object',
      properties: {
        orderId: { type: 'number', example: 12345 }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos fornecidos.',
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticação inválido ou ausente.',
  })
  postOrder(@Req() req: ReqWithAuthContext, @Body() dto: PostOrderDto) {
    const { credentialsId, storeId } = req.authContext || {};

    if (!credentialsId) {
      throw new Error('Credentials ID not found in token');
    }

    if (!storeId) {
      throw new Error('Store ID not found in token');
    }

    return this.orderService.post(credentialsId, dto, storeId);
  }

  @Post(':id/receipt')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions({ allOf: ['tenant.orders.view'] })
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Gerar cupom fiscal para um pedido',
    description:
      'Gera um cupom fiscal para um pedido específico e envia para o email do cliente.',
  })
  @ApiResponse({
    status: 201,
    description: 'Cupom fiscal gerado e email enviado.',
    schema: {
      type: 'object',
      properties: {
        receiptId: { type: 'number', example: 54321 }
      }
    }
  })
  postReceipt(
    @Req() req: ReqWithAuthContext,
    @Body() dto: GenerateReceiptDto,
    @Param('id') orderId: number,
  ) {
    const { credentialsId, storeId } = req.authContext || {};

    if (!credentialsId) {
      throw new Error('Credentials ID not found in token');
    }

    if (!storeId) {
      throw new Error('Store ID not found in token');
    }

    return this.orderService.generateReceipt(credentialsId, orderId, storeId, {
      email: dto.email,
      cpf: dto.cpf,
    });
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions({ allOf: ['tenant.orders.view'] })
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obter pedidos',
    description: 'Retorna uma lista de pedidos da loja.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de pedidos retornada com sucesso.',
    type: [OrderResponseDto],
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Página atual',
    example: 1,
    default: 1,
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: Number,
    description: 'Quantidade de itens por página',
    example: 10,
    default: 10,
  })
  @ApiQuery({
    name: 'storeId',
    required: false,
    type: Number,
    description: 'ID da loja (LOJ_CODIGO)',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    description: 'Data inicial (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    description: 'Data final (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'clientId',
    required: false,
    type: Number,
    description: 'ID do cliente (CLI_CODIGO)',
  })
  @ApiQuery({
    name: 'employeeId',
    required: false,
    type: Number,
    description: 'ID do funcionário (FUN_CODIGO)',
  })
  getOrders(
    @Req() req: ReqWithAuthContext,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('storeId') storeIdQuery?: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('clientId') clientId?: number,
    @Query('employeeId') employeeId?: number,
  ) {
    const { credentialsId, storeId: storeIdToken } = req.authContext || {};

    if (!credentialsId) {
      throw new Error('Credentials ID not found in token');
    }

    const finalStoreId = storeIdQuery ? Number(storeIdQuery) : storeIdToken;

    return this.orderService.get(credentialsId, finalStoreId, page, pageSize, {
      startDate,
      endDate,
      clientId: clientId ? Number(clientId) : undefined,
      employeeId: employeeId ? Number(employeeId) : undefined,
    });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions({ allOf: ['tenant.orders.view'] })
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obter detalhes de um pedido pelo ID',
    description:
      'Retorna os detalhes de um pedido específico com base no ID fornecido.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID do pedido a ser retornado',
  })
  @ApiQuery({
    name: 'storeId',
    required: false,
    type: Number,
    description: 'ID da loja (LOJ_CODIGO)',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalhes do pedido retornados com sucesso.',
    type: OrderDetailResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Erro de requisição, como ID inválido.',
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticação inválido ou ausente.',
  })
  async getOrderById(
    @Req() req: ReqWithAuthContext,
    @Param('id') id: number,
    @Query('storeId') storeIdQuery?: number,
  ) {
    const { credentialsId, storeId: storeIdToken } = req.authContext || {};

    if (!credentialsId) {
      throw new Error('Credentials ID not found in token');
    }

    const finalStoreId = storeIdQuery ? Number(storeIdQuery) : storeIdToken;

    const orderData = await this.orderService.getById(
      credentialsId,
      finalStoreId,
      id,
    );
    const orderItems = await this.orderItemService.getByOrderId(
      credentialsId,
      id,
    );

    return { ...orderData, items: orderItems };
  }
}
