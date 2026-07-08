import type { ReqWithAuthContext } from './../auth/guards/jwt-auth.guard';
import {
  BadRequestException,
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PaymentMethodService } from './payment-method.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { PermissionsGuard } from 'src/infra/rbac/permissions.guard';
import { RequirePermissions } from 'src/infra/rbac/permissions.decorator';

import { PaymentMethodResponseDto } from './dto/payment-method-response.dto';

import { GetPaymentMethodsQueryDto } from './dto/get-payment-methods-query.dto';

@Controller('payment-methods')
export class PaymentMethodController {
  constructor(private readonly paymentMethodService: PaymentMethodService) {}

  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions({ allOf: ['tenant.payment-methods.view'] })
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Listar formas de pagamento',
    description:
      'Retorna uma lista paginada de formas de pagamento associados às credenciais do usuário autenticado.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de formas de pagamento retornada com sucesso.',
    type: [PaymentMethodResponseDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Erro de requisição, como pageSize excedendo o limite.',
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticação inválido ou ausente.',
  })
  getPaymentMethods(
    @Req() req: ReqWithAuthContext,
    @Query() query: GetPaymentMethodsQueryDto,
  ) {
    const credentialsId = req.authContext?.credentialsId;

    if (!credentialsId) {
      throw new Error('Credentials ID not found in token');
    }

    return this.paymentMethodService.get(credentialsId, query.page, query.pageSize);
  }
}
