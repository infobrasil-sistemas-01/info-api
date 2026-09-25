import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/infra/rbac/permissions.guard';
import { RequirePermissions } from 'src/infra/rbac/permissions.decorator';
import { ClientService } from './client.service';
import { GetClientsQueryDto } from './dto/get-clients-query.dto';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import {
  ClientResponseDto,
  ClientDetailResponseDto,
} from './dto/client-response.dto';
import { ClientCreateResponseDto } from './dto/client-create-response.dto';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';

@ApiTags('Client')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) { }

  @Get()
  @RequirePermissions({ allOf: ['tenant.clients.view'] })
  @ApiOperation({ summary: 'Listar clientes' })
  @ApiResponse({
    status: 200,
    description: 'Lista de clientes',
    type: [ClientResponseDto],
  })
  async get(@CurrentUser() user: any, @Query() query: GetClientsQueryDto) {
    if (
      user.type === 'H2M' &&
      query.storeId &&
      query.storeId !== user.store_id
    ) {
      throw new ForbiddenException(
        'Operador não autorizado a consultar dados de outra filial',
      );
    }

    const storeId =
      user.type === 'H2M'
        ? user.store_id
        : (query.storeId ?? user.store_id);

    return this.clientService.get(
      user.credentials_id,
      storeId,
      query.page,
      query.pageSize,
      query.search,
      query.situation,
      query.birthdate,
      query.routeId,
    );
  }

  @Get(':id')
  @RequirePermissions({ allOf: ['tenant.clients.view'] })
  @ApiOperation({ summary: 'Obter detalhe do cliente' })
  @ApiParam({
    name: 'id',
    description: 'ID do cliente (CLI_CODIGO)',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Detalhes do cliente',
    type: ClientDetailResponseDto,
  })
  async getById(
    @CurrentUser() user: any,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.clientService.getById(user.credentials_id, user.store_id, id);
  }

  @Post()
  @RequirePermissions({ allOf: ['tenant.clients.create'] })
  @ApiOperation({ summary: 'Criar cliente' })
  @ApiResponse({
    status: 201,
    description: 'Cliente criado com sucesso.',
    type: ClientCreateResponseDto,
  })
  async create(@CurrentUser() user: any, @Body() body: CreateClientDto) {
    return this.clientService.create(user.credentials_id, user.store_id, body);
  }

  @Patch(':id')
  @RequirePermissions({ allOf: ['tenant.clients.update'] })
  @ApiOperation({ summary: 'Atualizar cliente' })
  @ApiResponse({
    status: 200,
    description: 'Cliente atualizado com sucesso',
    type: ClientDetailResponseDto,
  })
  async update(
    @CurrentUser() user: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateClientDto,
  ) {
    return this.clientService.update(
      user.credentials_id,
      user.store_id,
      id,
      body,
    );
  }
}
