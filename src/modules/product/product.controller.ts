import {
  Controller,
  Get,
  UseGuards,
  Req,
  Query,
  NotFoundException,
  Param,
  ParseIntPipe,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiQuery,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiHeader,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { ReqWithAuthContext } from '../auth/guards/jwt-auth.guard';
import { ProductService } from './product.service';
import { PermissionsGuard } from 'src/infra/rbac/permissions.guard';
import { RequirePermissions } from 'src/infra/rbac/permissions.decorator';
import { IncludeCount } from 'src/common/decorators/include-count.decorator';
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
  @ApiHeader({
    name: 'X-Request-Count',
    required: false,
    description:
      'Se definido como "true", calcula e retorna cabeçalhos de paginação (X-Total-Count, X-Total-Pages, X-Current-Page, X-Per-Page) na resposta.',
    schema: { type: 'string', example: 'true' },
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de produtos retornada com sucesso.',
    type: [ProductResponseDto],
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
  @ApiResponse({
    status: 400,
    description:
      'Erro de requisição, como pageSize excedendo o limite ou storeId ausente para M2M.',
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticação inválido ou ausente.',
  })
  @ApiResponse({
    status: 403,
    description: 'Operador não autorizado a consultar dados de outra filial.',
  })
  getProducts(
    @Req() req: ReqWithAuthContext,
    @Query() query: GetProductsQueryDto,
    @IncludeCount() includeCount: boolean = false,
  ) {
    const {
      credentialsId,
      storeId: tokenStoreId,
      type,
    } = req.authContext || {};

    if (!credentialsId) {
      throw new Error('Credentials ID not found in token');
    }

    let storeId: number;

    if (type === 'H2M') {
      if (query.storeId && query.storeId !== tokenStoreId) {
        throw new ForbiddenException(
          'Operador não autorizado a consultar dados de outra filial',
        );
      }
      storeId = tokenStoreId!;
    } else {
      if (!query.storeId) {
        throw new BadRequestException(
          'O parâmetro storeId é obrigatório para integrações diretas (M2M)',
        );
      }
      storeId = query.storeId;
    }

    return this.productService.get(
      credentialsId,
      storeId,
      query.page,
      query.pageSize,
      query.priceTable,
      query.group,
      query.brand,
      query.minStock,
      query.search,
      query.startDateAlteracao,
      query.endDateAlteracao,
      includeCount,
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
    @Param('id', ParseIntPipe) id: number,
    @Query() query: GetProductQueryDto,
  ) {
    const {
      credentialsId,
      storeId: tokenStoreId,
      type,
    } = req.authContext || {};

    if (!credentialsId) {
      throw new Error('Credentials ID not found in token');
    }

    const storeId =
      type === 'H2M' ? tokenStoreId || 1 : query.storeId || tokenStoreId || 1;

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
    const {
      credentialsId,
      storeId: tokenStoreId,
      type,
    } = req.authContext || {};

    if (!credentialsId) {
      throw new Error('Credentials ID not found in token');
    }

    const storeId =
      type === 'H2M' ? tokenStoreId || 1 : query.storeId || tokenStoreId || 1;

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
