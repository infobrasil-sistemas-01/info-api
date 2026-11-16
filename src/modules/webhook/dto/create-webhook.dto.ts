import { ApiProperty } from '@nestjs/swagger';
import { ZodDto } from 'src/common/validation/zod-dto';
import { z } from 'zod';

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

export const CreateWebhookSchema = z.object({
  targetUrl: z
    .string()
    .url('A URL de destino deve ser uma URL válida')
    .max(500, 'A URL não pode exceder 500 caracteres'),
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
