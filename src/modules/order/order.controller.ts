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
      example: {
        orderId: 12345
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
      example: {
        receiptId: 54321
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
    schema: {
      example: [
        {
          VEN_NUMERO: 12345,
          VEN_NUMSITE: "WEB-12345",
          LOJ_CODIGO: 1,
          VEN_TIPO: "E",
          VEN_DATA: "2024-05-10T00:00:00.000Z",
          VEN_HORA: "14:30:00",
          FP1_CODIGO: 1,
          fpg_descricao: "Dinheiro",
          pp1_codigo: 1,
          plp_descricao: "A Vista",
          ven_totalliquido: 250.50
        }
      ]
    }
  })
  @ApiQuery({
    name: 'page',
    required: false,
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
  })
  getOrders(
    @Req() req: ReqWithAuthContext,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    const { credentialsId, storeId } = req.authContext || {};

    if (!credentialsId) {
      throw new Error('Credentials ID not found in token');
    }

    if (!storeId) {
      throw new Error('Store ID not found in token');
    }

    return this.orderService.get(credentialsId, storeId, page, pageSize);
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
  @ApiResponse({
    status: 200,
    description: 'Detalhes do pedido retornados com sucesso.',
    schema: {
      example: {
        VEN_NUMERO: 12345,
        VEN_NUMSITE: "WEB-12345",
        LOJ_CODIGO: 1,
        VEN_TIPO: "E",
        VEN_PRECO: "1",
        VEN_DATA: "2024-05-10T00:00:00.000Z",
        VEN_HORA: "14:30:00",
        FP1_CODIGO: 1,
        fpg_descricao: "Dinheiro",
        pp1_codigo: 1,
        plp_descricao: "A Vista",
        VEN_TOTALBRUTO: 300.00,
        ven_totaldesc: 49.50,
        ven_totalliquido: 250.50,
        ven_quant: 2,
        items: [
          {
            ITE_SEQUENCIA: 1,
            PRO_CODIGO: 101,
            ITE_QUANT: 2,
            ITE_PRECO: 150.00
          }
        ]
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Erro de requisição, como ID inválido.',
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticação inválido ou ausente.',
  })
  async getOrderById(@Req() req: ReqWithAuthContext, @Param('id') id: number) {
    const { credentialsId, storeId } = req.authContext || {};

    if (!credentialsId) {
      throw new Error('Credentials ID not found in token');
    }

    if (!storeId) {
      throw new Error('Store ID not found in token');
    }

    const orderData = await this.orderService.getById(
      credentialsId,
      storeId,
      id,
    );
    const orderItems = await this.orderItemService.getByOrderId(
      credentialsId,
      id,
    );

    return { ...orderData, items: orderItems };
  }
}
