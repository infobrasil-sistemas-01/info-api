import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { PostOrderDto } from './dto/create-order.dto';
import {
  OrderResponseDto,
  OrderDetailResponseDto,
} from './dto/order-response.dto';
import {
  JwtAuthGuard,
  type ReqWithAuthContext,
} from '../auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { OrderItemService } from './order-item/order-item.service';
import { GenerateReceiptDto } from './dto/generate-receipt.dto';
import { PermissionsGuard } from 'src/infra/rbac/permissions.guard';
import { RequirePermissions } from 'src/infra/rbac/permissions.decorator';

import { GetOrdersQueryDto } from './dto/get-orders-query.dto';
import { GetOrderByIdQueryDto } from './dto/get-order-by-id-query.dto';
import { IncludeCount } from 'src/common/decorators/include-count.decorator';

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
        orderId: { type: 'number', example: 12345 },
      },
    },
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
    const { credentialsId, storeId, type, usuCodigo, funCodigo } =
      req.authContext || {};

    if (!credentialsId) {
      throw new Error('Credentials ID not found in token');
    }

    if (!storeId) {
      throw new Error('Store ID not found in token');
    }

    const isH2M = type === 'H2M';
    const effectiveStoreId = isH2M ? storeId : dto.store_id || storeId;
    const effectiveUserId = isH2M
      ? (usuCodigo ?? 9999)
      : dto.user_id || dto.employee_id || 9999;
    const effectiveEmployeeId = isH2M
      ? (funCodigo ?? usuCodigo ?? 9999)
      : dto.employee_id || 9999;

    const sanitizedDto: PostOrderDto = {
      ...dto,
      store_id: effectiveStoreId,
      user_id: effectiveUserId,
      employee_id: effectiveEmployeeId,
    };

    return this.orderService.post(
      credentialsId,
      sanitizedDto,
      effectiveStoreId,
    );
  }

  /* @Post(':id/receipt')
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
        receiptId: { type: 'number', example: 54321 },
      },
    },
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
  } */

  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions({ allOf: ['tenant.orders.view'] })
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obter pedidos',
    description: 'Retorna uma lista de pedidos da loja.',
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
    description: 'Lista de pedidos retornada com sucesso.',
    type: [OrderResponseDto],
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
  getOrders(@Req() req: ReqWithAuthContext, @Query() query: GetOrdersQueryDto, @IncludeCount() includeCount: boolean = false) {
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

    return this.orderService.get(
      credentialsId,
      finalStoreId,
      query.page,
      query.pageSize,
      includeCount,
      {
        startDate: query.startDate,
        endDate: query.endDate,
        clientId: query.clientId ? Number(query.clientId) : undefined,
        employeeId: query.employeeId ? Number(query.employeeId) : undefined,
      },
    );
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
    @Param('id', ParseIntPipe) id: number,
    @Query() query: GetOrderByIdQueryDto,
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

    const orderData = (await this.orderService.getById(
      credentialsId,
      finalStoreId,
      id,
    )) as any;

    if (!orderData) {
      throw new NotFoundException(`Pedido ${id} não encontrado`);
    }

    const orderItems = (await this.orderItemService.getByOrderId(
      credentialsId,
      id,
    )) as any[];

    orderData.PESO = orderItems.reduce(
      (acc, item) => acc + item.PRO_PESO * item.IVD_QTDE,
      0,
    );

    return { ...orderData, items: orderItems };
  }
}
