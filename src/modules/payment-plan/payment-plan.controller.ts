import type { ReqWithAuthContext } from './../auth/guards/jwt-auth.guard';
import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { PaymentPlanService } from './payment-plan.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { PermissionsGuard } from 'src/infra/rbac/permissions.guard';
import { RequirePermissions } from 'src/infra/rbac/permissions.decorator';

import { PaymentPlanResponseDto } from './dto/payment-plan-response.dto';

import { GetPaymentPlansQueryDto } from './dto/get-payment-plans-query.dto';

@Controller('payment-plans')
export class PaymentPlanController {
  constructor(private readonly paymentPlanService: PaymentPlanService) {}

  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions({ allOf: ['tenant.payment-plans.view'] })
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Listar planos de pagamento',
    description:
      'Retorna uma lista paginada de planos de pagamento associados às credenciais do usuário autenticado.',
    tags: ['Payment Plan'],
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de planos de pagamento retornada com sucesso.',
    type: [PaymentPlanResponseDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Erro de requisição, como pageSize excedendo o limite.',
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticação inválido ou ausente.',
  })
  getPaymentPlans(
    @Req() req: ReqWithAuthContext,
    @Query() query: GetPaymentPlansQueryDto,
  ) {
    const credentialsId = req.authContext?.credentialsId;

    if (!credentialsId) {
      throw new Error('Credentials ID not found in token');
    }

    return this.paymentPlanService.get(credentialsId, query.page, query.pageSize);
  }
}
