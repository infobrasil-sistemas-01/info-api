import {
  BadRequestException,
  Controller,
  Get,
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
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          MAR_CODIGO: { type: 'number', example: 1 },
          MAR_DESCRICAO: { type: 'string', example: "Marca Exemplo" }
        }
      }
    }
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
}
