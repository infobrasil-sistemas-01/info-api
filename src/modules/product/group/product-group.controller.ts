import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  JwtAuthGuard,
  type ReqWithAuthContext,
} from 'src/modules/auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { ProductGroupService } from './product-group.service';
import { PermissionsGuard } from 'src/infra/rbac/permissions.guard';
import { RequirePermissions } from 'src/infra/rbac/permissions.decorator';

import { ProductGroupResponseDto } from '../dto/product-response.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

import { GetProductGroupsQueryDto } from './dto/get-product-groups-query.dto';

@Controller('products/groups')
export class ProductGroupController {
  constructor(private readonly groupService: ProductGroupService) {}

  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions({ allOf: ['tenant.groups.view'] })
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Listar grupos de produtos',
    description:
      'Retorna uma lista paginada de grupos de produtos associadas às credenciais do usuário autenticado.',
    tags: ['Product / Group'],
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de grupos de produtos retornada com sucesso.',
    type: [ProductGroupResponseDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Erro de requisição, como pageSize excedendo o limite.',
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticação inválido ou ausente.',
  })
  getGroups(
    @Req() req: ReqWithAuthContext,
    @Query() query: GetProductGroupsQueryDto,
  ) {
    const credentialsId = req.authContext?.credentialsId;

    if (!credentialsId) {
      throw new Error('Credentials ID not found in token');
    }

    return this.groupService.get(credentialsId, query.page, query.pageSize);
  }

  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions({ allOf: ['tenant.groups.create'] })
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Criar grupo de produto',
    description: 'Cria um novo grupo de produto associado ao tenant.',
    tags: ['Product / Group'],
  })
  @ApiResponse({
    status: 201,
    description: 'Grupo criado com sucesso.',
    type: ProductGroupResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Erro de validação ou de requisição.',
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticação inválido ou ausente.',
  })
  async createGroup(
    @Req() req: ReqWithAuthContext,
    @Body() body: CreateGroupDto,
  ) {
    const credentialsId = req.authContext?.credentialsId;

    if (!credentialsId) {
      throw new Error('Credentials ID not found in token');
    }

    return this.groupService.create(credentialsId, body);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions({ allOf: ['tenant.groups.update'] })
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualizar grupo de produto',
    description:
      'Atualiza os dados de um grupo de produto existente no tenant.',
    tags: ['Product / Group'],
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Código do grupo (GRU_CODIGO) a ser atualizado',
  })
  @ApiResponse({
    status: 200,
    description: 'Grupo atualizado com sucesso.',
    type: ProductGroupResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Erro de validação ou de requisição.',
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticação inválido ou ausente.',
  })
  @ApiResponse({
    status: 404,
    description: 'Grupo não encontrado.',
  })
  async updateGroup(
    @Req() req: ReqWithAuthContext,
    @Param('id') id: number,
    @Body() body: UpdateGroupDto,
  ) {
    const credentialsId = req.authContext?.credentialsId;

    if (!credentialsId) {
      throw new Error('Credentials ID not found in token');
    }

    return this.groupService.update(credentialsId, Number(id), body);
  }
}
