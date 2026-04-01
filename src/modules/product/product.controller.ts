import {
  Controller,
  Get,
  UseGuards,
  Req,
  Query,
  BadRequestException,
  NotFoundException,
  Param,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiQuery,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { ReqWithAuthContext } from '../auth/guards/jwt-auth.guard';
import { ProductService } from './product.service';
import { min } from 'date-fns';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Listar produtos',
    description:
      'Retorna uma lista paginada de produtos associados às credenciais do usuário autenticado.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de produtos retornada com sucesso.',
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
  @ApiQuery({
    name: 'group',
    required: false,
    type: Number,
    description: 'Código do grupo para filtrar produtos',
  })
  @ApiQuery({
    name: 'brand',
    required: false,
    type: Number,
    description: 'Código da marca para filtrar produtos',
  })
  @ApiQuery({
    name: 'minStock',
    required: false,
    type: Number,
    description: 'Quantidade mínima em estoque para filtrar produtos',
  })
  getProducts(
    @Req() req: ReqWithAuthContext,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('group') group?: number,
    @Query('brand') brand?: number,
    @Query('minStock') minStock?: number,
  ) {
    const credentialsId = req.authContext?.credentialsId;
    const storeId = req.authContext?.storeId;

    if (!credentialsId) {
      throw new Error('Credentials ID not found in token');
    }

    if (pageSize && pageSize > 25) {
      throw new BadRequestException('pageSize cannot exceed 25');
    }

    return this.productService.get(
      credentialsId,
      storeId,
      page,
      pageSize,
      group,
      brand,
      minStock,
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obter detalhes de um produto pelo ID',
    description:
      'Retorna os detalhes de um produto específico com base no ID fornecido.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID do produto a ser retornado',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalhes do produto retornados com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description: 'Erro de requisição, como ID inválido.',
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticação inválido ou ausente.',
  })
  async getProductById(
    @Req() req: ReqWithAuthContext,
    @Param('id') id: number,
  ) {
    const credentialsId = req.authContext?.credentialsId;
    const storeId = req.authContext?.storeId;

    if (!credentialsId) {
      throw new Error('Credentials ID not found in token');
    }

    const product = await this.productService.getUnique(
      credentialsId,
      storeId,
      id,
      undefined,
    );

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  @Get('/ean/:ean')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obter detalhes de um produto pelo EAN',
    description:
      'Retorna os detalhes de um produto específico com base no EAN fornecido.',
  })
  @ApiParam({
    name: 'ean',
    type: Number,
    description: 'EAN do produto a ser retornado',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalhes do produto retornados com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description: 'Erro de requisição, como EAN inválido.',
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticação inválido ou ausente.',
  })
  async getProductByEan(
    @Req() req: ReqWithAuthContext,
    @Param('ean') ean: number,
  ) {
    const credentialsId = req.authContext?.credentialsId;
    const storeId = req.authContext?.storeId;

    if (!credentialsId) {
      throw new Error('Credentials ID not found in token');
    }

    const product = await this.productService.getUnique(
      credentialsId,
      storeId,
      undefined,
      ean,
    );

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }
}
