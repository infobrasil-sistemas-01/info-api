import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { ReqWithAuthContext } from '../auth/guards/jwt-auth.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/infra/rbac/permissions.guard';
import { RequirePermissions } from 'src/infra/rbac/permissions.decorator';
import { PurchaseService } from './purchase.service';
import { PurchaseQueryDto } from './dto/purchase-query.dto';
import { PurchaseResponseDto } from './dto/purchase-response.dto';

@ApiTags('Purchase')
@Controller('purchase')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions({ allOf: ['tenant.purchases.view'] })
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Listar compras / entradas de mercadorias',
    description:
      'Retorna uma lista paginada de entradas de notas fiscais e compras da tabela COMPRAS com dados do fornecedor.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de compras/entradas retornada com sucesso.',
    type: [PurchaseResponseDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Parâmetros de busca inválidos.',
  })
  get(@Req() req: ReqWithAuthContext, @Query() query: PurchaseQueryDto) {
    const credentialsId = req.authContext?.credentialsId;

    if (!credentialsId) {
      throw new Error('Credentials ID not found in token');
    }

    return this.purchaseService.get(credentialsId, query);
  }
}
