import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import {
  JwtAuthGuard,
  type ReqWithAuthContext,
} from '../auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PermissionsGuard } from 'src/infra/rbac/permissions.guard';
import { RequirePermissions } from 'src/infra/rbac/permissions.decorator';
import { GetDeliveriesQueryDto } from './dto/get-deliveries-query.dto';
import { GetDeliveryByIdQueryDto } from './dto/get-delivery-by-id-query.dto';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import {
  DeliveryResponseDto,
  DeliveryDetailResponseDto,
} from './dto/delivery-response.dto';

@ApiTags('Delivery')
@Controller('deliveries')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Get()
  @RequirePermissions({ allOf: ['tenant.deliveries.view'] })
  @ApiOperation({
    summary: 'Obter entregas',
    description: 'Retorna uma lista paginada de entregas.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de entregas retornada com sucesso.',
    type: [DeliveryResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticação inválido ou ausente.',
  })
  async getDeliveries(
    @Req() req: ReqWithAuthContext,
    @Query() query: GetDeliveriesQueryDto,
  ) {
    const { credentialsId, storeId: storeIdToken } = req.authContext || {};

    if (!credentialsId) {
      throw new Error('Credentials ID not found in token');
    }

    const finalStoreId = query.storeId ? Number(query.storeId) : storeIdToken;

    return this.deliveryService.get(
      credentialsId,
      finalStoreId,
      query.page,
      query.pageSize,
      {
        startDate: query.startDate,
        endDate: query.endDate,
        situation: query.situation,
        vehiclePlate: query.vehiclePlate,
        providerId: query.providerId,
      },
    );
  }

  @Get(':id')
  @RequirePermissions({ allOf: ['tenant.deliveries.view'] })
  @ApiOperation({
    summary: 'Obter detalhes de uma entrega pelo ID',
    description:
      'Retorna os detalhes de uma entrega específica com os itens vinculados.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID da entrega (ENT_NUMERO) a ser retornada',
    example: 100,
  })
  @ApiResponse({
    status: 200,
    description: 'Detalhes da entrega retornados com sucesso.',
    type: DeliveryDetailResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Entrega não encontrada.',
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticação inválido ou ausente.',
  })
  async getDeliveryById(
    @Req() req: ReqWithAuthContext,
    @Param('id') id: number,
    @Query() query: GetDeliveryByIdQueryDto,
  ) {
    const { credentialsId, storeId: storeIdToken } = req.authContext || {};

    if (!credentialsId) {
      throw new Error('Credentials ID not found in token');
    }

    const finalStoreId = query.storeId ? Number(query.storeId) : storeIdToken;

    const delivery = await this.deliveryService.getById(
      credentialsId,
      Number(id),
      finalStoreId,
    );

    if (!delivery) {
      throw new NotFoundException(`Entrega com o ID ${id} não encontrada.`);
    }

    return delivery;
  }

  @Post()
  @RequirePermissions({ allOf: ['tenant.deliveries.create'] })
  @ApiOperation({
    summary: 'Inserir entrega',
    description: 'Cria uma nova entrega no banco de dados do tenant.',
  })
  @ApiResponse({
    status: 201,
    description: 'Entrega criada com sucesso.',
    type: DeliveryDetailResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Erro de validação ou requisição inválida.',
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticação inválido ou ausente.',
  })
  async createDelivery(
    @Req() req: ReqWithAuthContext,
    @Body() body: CreateDeliveryDto,
  ) {
    const { credentialsId } = req.authContext || {};

    if (!credentialsId) {
      throw new Error('Credentials ID not found in token');
    }

    return this.deliveryService.create(credentialsId, body);
  }
}
