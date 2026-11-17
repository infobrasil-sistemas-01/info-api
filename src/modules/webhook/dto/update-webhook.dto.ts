import { ApiPropertyOptional } from '@nestjs/swagger';
import { ZodDto } from 'src/common/validation/zod-dto';
import { z } from 'zod';
import {
  SUPPORTED_WEBHOOK_EVENTS,
  type SupportedWebhookEvent,
} from './create-webhook.dto';
import { validateWebhookUrlSyntax } from '../utils/webhook-security.util';

export const UpdateWebhookSchema = z.object({
  targetUrl: z
    .string()
    .url('A URL de destino deve ser uma URL válida')
    .max(500, 'A URL não pode exceder 500 caracteres')
    .refine((url) => validateWebhookUrlSyntax(url).valid, {
      message:
        'A URL de Webhook deve ser HTTPS, utilizar um domínio (não IP), não ser localhost e não pertencer ao domínio raiz da InfoBrasil.',
    })
    .optional(),
  events: z
    .array(z.enum(SUPPORTED_WEBHOOK_EVENTS))
    .min(1, 'Selecione ao menos um evento para assinar')
    .optional(),
  isActive: z.boolean().optional(),
});

export class UpdateWebhookDto extends ZodDto(UpdateWebhookSchema) {
  @ApiPropertyOptional({
    example: 'https://n8n.meuservidor.com/webhook/vendas-v2',
    description: 'Nova URL de destino',
  })
  targetUrl?: string;

  @ApiPropertyOptional({
    example: ['order.created', 'order.updated'],
    description: 'Lista atualizada de eventos assinados',
    enum: SUPPORTED_WEBHOOK_EVENTS,
    isArray: true,
  })
  events?: SupportedWebhookEvent[];

  @ApiPropertyOptional({
    example: true,
    description: 'Status ativo ou pausado da inscrição',
  })
  isActive?: boolean;
}
