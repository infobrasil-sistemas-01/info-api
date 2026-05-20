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
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Termo de busca para filtrar produtos por descrição',
  })
  @ApiQuery({
    name: 'storeId',
    required: true,
    type: Number,
    description: 'Código da loja para buscar os estoques dos produtos',
    default: 1,
    example: 1,
  })
  @ApiQuery({
    name: 'priceTable',
    required: false,
    type: Number,
    description:
      'Código da tabela de preço para buscar os preços dos produtos. Se não informado, será usado o valor 1.',
    default: 1,
    example: 1,
  })
  getProducts(
    @Req() req: ReqWithAuthContext,
    @Query('storeId') storeId: number,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('priceTable') priceTable?: number,
    @Query('group') group?: number,
    @Query('brand') brand?: number,
    @Query('minStock') minStock?: number,
    @Query('search') search?: string,
  ) {
    const credentialsId = req.authContext?.credentialsId;

    if (!credentialsId) {
      throw new Error('Credentials ID not found in token');
    }

    return this.productService.get(
      credentialsId,
      storeId,
      page,
      pageSize,
      priceTable,
      group,
      brand,
      minStock,
      search,
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
  @ApiQuery({
    name: 'priceTable',
    required: false,
    type: Number,
    description:
      'Código da tabela de preço para buscar os preços dos produtos. Se não informado, será usado o valor 1.',
    default: 1,
    example: 1,
  })
  @ApiQuery({
    name: 'storeId',
    required: false,
    type: Number,
    description:
      'Código da loja para buscar os estoques dos produtos. Se não informado, será usado o valor 1.',
    default: 1,
    example: 1,
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
    @Query('priceTable') priceTable?: number,
    @Query('storeId') storeId?: number,
  ) {
    const credentialsId = req.authContext?.credentialsId;
    // const storeId = req.authContext?.storeId;

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
      priceTable,
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
  @ApiQuery({
    name: 'priceTable',
    required: false,
    type: Number,
    description:
      'Código da tabela de preço para buscar os preços dos produtos. Se não informado, será usado o valor 1.',
    default: 1,
    example: 1,
  })
  @ApiQuery({
    name: 'storeId',
    required: false,
    type: Number,
    description:
      'Código da loja para buscar os estoques dos produtos. Se não informado, será usado o valor 1.',
    default: 1,
    example: 1,
  })
  async getProductByBarcode(
    @Req() req: ReqWithAuthContext,
    @Param('barcode') barcode: number,
    @Query('priceTable') priceTable?: number,
    @Query('storeId') storeId?: number,
  ) {
    const credentialsId = req.authContext?.credentialsId;
    // const storeId = req.authContext?.storeId;

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
      priceTable,
    );

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }
}
