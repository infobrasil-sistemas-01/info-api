import {
  Controller,
  Get,
  UseGuards,
  Req,
  Query,
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
import { PermissionsGuard } from 'src/infra/rbac/permissions.guard';
import { RequirePermissions } from 'src/infra/rbac/permissions.decorator';
import {
  ProductResponseDto,
  ProductDetailResponseDto,
  ProductBarcodeResponseDto,
} from './dto/product-response.dto';

import { GetProductsQueryDto } from './dto/get-products-query.dto';
import { GetProductQueryDto } from './dto/get-product-query.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions({ allOf: ['tenant.products.view'] })
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Listar produtos',
    description:
      'Retorna uma lista paginada de produtos associados às credenciais do usuário autenticado.',
    tags: ['Product'],
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de produtos retornada com sucesso.',
    type: [ProductResponseDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Erro de requisição, como pageSize excedendo o limite.',
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticação inválido ou ausente.',
  })
  getProducts(
    @Req() req: ReqWithAuthContext,
    @Query() query: GetProductsQueryDto,
  ) {
    const credentialsId = req.authContext?.credentialsId;

    if (!credentialsId) {
      throw new Error('Credentials ID not found in token');
    }

    return this.productService.get(
      credentialsId,
      query.storeId,
      query.page,
      query.pageSize,
      query.priceTable,
      query.group,
      query.brand,
      query.minStock,
      query.search,
    );
  }

  @Get('/id/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions({ allOf: ['tenant.products.view'] })
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obter detalhes de um produto pelo ID',
    description:
      'Retorna os detalhes de um produto específico com base no ID fornecido.',
    tags: ['Product'],
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID do produto a ser retornado',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalhes do produto retornados com sucesso.',
    type: ProductDetailResponseDto,
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
    @Query() query: GetProductQueryDto,
  ) {
    const credentialsId = req.authContext?.credentialsId;
    let storeId = query.storeId;

    if (!credentialsId) {
      throw new Error('Credentials ID not found in token');
    }

    if (!storeId) {
      storeId = req.authContext?.storeId;
    }

    const product = await this.productService.getUnique(
      credentialsId,
      storeId,
      id,
      undefined,
      query.priceTable,
    );

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  @Get('/barcode/:barcode')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions({ allOf: ['tenant.products.view'] })
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obter detalhes de um produto pelo código de barras',
    description:
      'Retorna os detalhes de um produto específico com base no código de barras fornecido.',
  })
  @ApiParam({
    name: 'barcode',
    type: Number,
    description: 'Código de barras do produto a ser retornado',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalhes do produto retornados com sucesso.',
    type: ProductBarcodeResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Erro de requisição, como código de barras inválido.',
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticação inválido ou ausente.',
  })
  async getProductByBarcode(
    @Req() req: ReqWithAuthContext,
    @Param('barcode') barcode: number,
    @Query() query: GetProductQueryDto,
  ) {
    const credentialsId = req.authContext?.credentialsId;
    let storeId = query.storeId;

    if (!credentialsId) {
      throw new Error('Credentials ID not found in token');
    }

    if (!storeId) {
      storeId = req.authContext?.storeId;
    }

    const product = await this.productService.getUnique(
      credentialsId,
      storeId,
      undefined,
      barcode,
      query.priceTable,
    );

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }
}
