import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Body,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProductBrandService } from './product-brand.service';
import {
  JwtAuthGuard,
  type ReqWithAuthContext,
} from 'src/modules/auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { PermissionsGuard } from 'src/infra/rbac/permissions.guard';
import { RequirePermissions } from 'src/infra/rbac/permissions.decorator';

import { ProductBrandResponseDto } from '../dto/product-response.dto';
import { CreateBrandDto } from './dto/create-brand.dto';

@Controller('products/brands')
export class ProductBrandController {
  constructor(private readonly brandService: ProductBrandService) { }

  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions({ allOf: ['tenant.brands.view'] })
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Listar marcas de produtos',
    description:
      'Retorna uma lista paginada de marcas de produtos associadas às credenciais do usuário autenticado.',
    tags: ['Product / Brand'],
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de marcas de produtos retornada com sucesso.',
    type: [ProductBrandResponseDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Erro de requisição, como pageSize excedendo o limite.',
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticação inválido ou ausente.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número de página para paginação',
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: Number,
    description: 'Número de itens por página',
  })
  getBrands(
    @Req() req: ReqWithAuthContext,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    const credentialsId = req.authContext?.credentialsId;

    if (!credentialsId) {
      throw new Error('Credentials ID not found in token');
    }



    return this.brandService.get(credentialsId, page, pageSize);
  }

  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions({ allOf: ['tenant.brands.create'] })
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Criar marca de produto',
    description: 'Cria uma nova marca de produto associada ao tenant.',
    tags: ['Product / Brand'],
  })
  @ApiResponse({
    status: 201,
    description: 'Marca criada com sucesso.',
    type: ProductBrandResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Erro de validação ou de requisição.',
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticação inválido ou ausente.',
  })
  async createBrand(
    @Req() req: ReqWithAuthContext,
    @Body() body: CreateBrandDto,
  ) {
    const credentialsId = req.authContext?.credentialsId;

    if (!credentialsId) {
      throw new Error('Credentials ID not found in token');
    }

    return this.brandService.create(credentialsId, body);
  }
}
