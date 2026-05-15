import type { ReqWithAuthContext } from './../auth/guards/jwt-auth.guard';
import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { AccountPayableService } from './account-payable.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { PermissionsGuard } from 'src/infra/rbac/permissions.guard';
import { RequirePermissions } from 'src/infra/rbac/permissions.decorator';
import {
  AccountPayableDetailResponseDto,
  AccountPayableSummaryResponseDto,
} from './dto/account-payable-response.dto';
import { AccountPayableQueryDto } from './dto/account-payable-query.dto';

@Controller('account-payable')
export class AccountPayableController {
  constructor(private readonly accountPayableService: AccountPayableService) { }

  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions({ allOf: ['tenant.account-payable.view'] })
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Listar contas a pagar (Resumo)',
    description:
      'Retorna uma lista paginada e resumida de contas a pagar baseada nos filtros.',
    tags: ['Account Payable'],
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de contas a pagar.',
    type: [AccountPayableSummaryResponseDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Erro de validação nos filtros.',
  })
  getAccountPayable(
    @Req() req: ReqWithAuthContext,
    @Query() query: AccountPayableQueryDto,
  ) {
    const credentialsId = req.authContext?.credentialsId;

    if (!credentialsId) {
      throw new Error('Credentials ID not found in token');
    }

    return this.accountPayableService.get(
      credentialsId,
      query.page,
      query.pageSize,
      query.storeId,
      query.supplierId,
      query.situation,
      query.startDate,
      query.endDate,
    );
  }

  @Get('/id/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions({ allOf: ['tenant.account-payable.view'] })
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar detalhes da conta a pagar',
    description: 'Retorna os detalhes completos de uma conta a pagar pelo ID (PAG_NUMERO).',
    tags: ['Account Payable'],
  })
  @ApiResponse({
    status: 200,
    description: 'Detalhes da conta a pagar.',
    type: AccountPayableDetailResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Conta a pagar não encontrada.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Número da conta a pagar (PAG_NUMERO)',
  })
  getAccountPayableById(@Req() req: ReqWithAuthContext, @Param('id') id: number) {
    const credentialsId = req.authContext?.credentialsId;

    if (!credentialsId) {
      throw new Error('Credentials ID not found in token');
    }

    return this.accountPayableService.getById(credentialsId, id);
  }
}
