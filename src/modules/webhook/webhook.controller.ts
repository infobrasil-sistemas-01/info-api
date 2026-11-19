import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import type { JwtPayload } from 'src/modules/auth/types/jwt-payload';
import { WebhookService } from './webhook.service';
import { CreateWebhookDto } from './dto/create-webhook.dto';
import { UpdateWebhookDto } from './dto/update-webhook.dto';
import { BulkResendDeliveriesDto } from './dto/bulk-resend-deliveries.dto';

@ApiTags('Webhooks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('webhooks')
export class WebhookController {
  constructor(private readonly service: WebhookService) {}

  @Post()
  @ApiOperation({
    summary: 'Cria uma nova inscrição de Webhook para o usuário autenticado',
    description:
      'Gera uma chave secreta HMAC-SHA256 e inicializa os cursores de eventos a partir do momento da ativação.',
  })
  @ApiResponse({
    status: 201,
    description: 'Webhook criado com sucesso.',
  })
  @ApiResponse({
    status: 409,
    description: 'Usuário já possui um Webhook configurado (limite 1:1).',
  })
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateWebhookDto) {
    const credentialsId = user.credentialsId ?? user.credentials_id;
    return this.service.create(user.sub, dto, credentialsId);
  }

  @Get('me')
  @ApiOperation({
    summary: 'Consulta o Webhook configurado do usuário autenticado',
  })
  async getMine(@CurrentUser() user: JwtPayload) {
    const subscription = await this.service.getMine(user.sub);
    if (!subscription) {
      return {
        configured: false,
        subscription: null,
      };
    }
    return {
      configured: true,
      subscription,
      ...subscription,
    };
  }

  @Put('me')
  @ApiOperation({
    summary: 'Atualiza o Webhook do usuário autenticado',
  })
  update(@CurrentUser() user: JwtPayload, @Body() dto: UpdateWebhookDto) {
    return this.service.update(user.sub, dto);
  }

  @Post('me/rotate-secret')
  @ApiOperation({
    summary: 'Rotaciona a chave secreta HMAC de assinatura do Webhook',
  })
  rotateSecret(@CurrentUser() user: JwtPayload) {
    return this.service.rotateSecret(user.sub);
  }

  @Post('me/unpause')
  @ApiOperation({
    summary: 'Reativa os disparos de Webhook pausados pelo Circuit Breaker',
    description:
      'Quando um Webhook acumula 5 falhas consecutivas de eventos distintos, ele é pausado automaticamente. Este endpoint permite ao próprio cliente reativar os envios após corrigir seu endpoint.',
  })
  unpause(@CurrentUser() user: JwtPayload) {
    return this.service.unpause(user.sub);
  }

  @Delete('me')
  @ApiOperation({
    summary: 'Remove a inscrição de Webhook do usuário autenticado',
  })
  delete(@CurrentUser() user: JwtPayload) {
    return this.service.delete(user.sub);
  }

  @Get('me/deliveries')
  @ApiOperation({
    summary: 'Lista o histórico recente de entregas/tentativas de Webhook',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    example: 1,
    description:
      'Número da página (quando informado, retorna objeto paginado { data, meta })',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 25,
    description: 'Quantidade de registros por página (máximo 100)',
  })
  getDeliveries(
    @CurrentUser() user: JwtPayload,
    @Query('limit') limit?: string,
    @Query('page') page?: string,
  ) {
    const parsedPage = page ? parseInt(page, 10) : undefined;
    const parsedLimit = limit ? parseInt(limit, 10) : parsedPage ? 25 : 50;
    return this.service.getDeliveries(user.sub, parsedLimit, parsedPage);
  }

  @Post('me/test')
  @ApiOperation({
    summary: 'Dispara um evento de teste imediato (Ping) para a URL configurada',
    description:
      'Envia um payload test.ping assinado com HMAC-SHA256 para validar a ponta do integrador (ex: n8n) em tempo real.',
  })
  testWebhook(@CurrentUser() user: JwtPayload) {
    return this.service.testWebhook(user.sub);
  }

  @Post('me/deliveries/bulk-resend')
  @ApiOperation({
    summary:
      'Reenfileira múltiplas entregas (FAILED/PENDING) em lote para reenvio imediato',
  })
  bulkResendDeliveries(
    @CurrentUser() user: JwtPayload,
    @Body() dto: BulkResendDeliveriesDto,
  ) {
    return this.service.bulkResendDeliveries(user.sub, dto.deliveryIds);
  }

  @Post('me/deliveries/:id/resend')
  @ApiOperation({
    summary: 'Reenfileira uma entrega que falhou para reenvio imediato',
  })
  resendDelivery(
    @CurrentUser() user: JwtPayload,
    @Param('id') deliveryId: string,
  ) {
    return this.service.resendDelivery(user.sub, deliveryId);
  }

  @Get('admin/metrics')
  @ApiOperation({
    summary: 'Retorna métricas consolidadas de Webhooks para o painel administrativo',
  })
  getAdminMetrics() {
    return this.service.getAdminMetrics();
  }
}
