import { ApiProperty } from '@nestjs/swagger';
import { ZodDto } from 'src/common/validation/zod-dto';
import { z } from 'zod';
import { validateWebhookUrlSyntax } from '../utils/webhook-security.util';

export const SUPPORTED_WEBHOOK_EVENTS = [
  'order.created',
  'order.updated',
  'product.created',
  'product.updated',
  'delivery.created',
  'delivery.updated',
  'account_payable.created',
  'account_payable.updated',
  'account_receivable.created',
  'account_receivable.updated',
] as const;

export type SupportedWebhookEvent = (typeof SUPPORTED_WEBHOOK_EVENTS)[number];

export const EVENT_PERMISSION_MAP: Record<SupportedWebhookEvent, string> = {
  'order.created': 'tenant.orders.view',
  'order.updated': 'tenant.orders.view',
  'product.created': 'tenant.products.view',
  'product.updated': 'tenant.products.view',
  'delivery.created': 'tenant.deliveries.view',
  'delivery.updated': 'tenant.deliveries.view',
  'account_payable.created': 'tenant.account-payable.view',
  'account_payable.updated': 'tenant.account-payable.view',
  'account_receivable.created': 'tenant.account-receivable.view',
  'account_receivable.updated': 'tenant.account-receivable.view',
};

export const CreateWebhookSchema = z.object({
  targetUrl: z
    .string()
    .url('A URL de destino deve ser uma URL válida')
    .max(500, 'A URL não pode exceder 500 caracteres')
    .refine((url) => {
      const check = validateWebhookUrlSyntax(url);
      return check.valid;
    }, {
      message:
        'A URL de Webhook deve ser HTTPS, utilizar um domínio (não IP), não ser localhost e não pertencer ao domínio raiz da InfoBrasil.',
    }),
  events: z
    .array(z.enum(SUPPORTED_WEBHOOK_EVENTS))
    .min(1, 'Selecione ao menos um evento para assinar')
    .default([
      'order.created',
      'product.created',
      'delivery.created',
      'account_payable.created',
      'account_receivable.created',
    ]),
});

export class CreateWebhookDto extends ZodDto(CreateWebhookSchema) {
  @ApiProperty({
    example: 'https://n8n.meuservidor.com/webhook/vendas',
    description: 'URL de destino para o disparo das notificações HTTP POST',
  })
  targetUrl!: string;

  @ApiProperty({
    example: ['order.created', 'product.updated', 'delivery.created'],
    description: 'Eventos assinados',
    enum: SUPPORTED_WEBHOOK_EVENTS,
    isArray: true,
  })
  events!: SupportedWebhookEvent[];
}
