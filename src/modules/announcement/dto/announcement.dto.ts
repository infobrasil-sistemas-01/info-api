import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ZodDto } from 'src/common/validation/zod-dto';
import { z } from 'zod';

export const AnnouncementTypeEnum = z.enum(['DOC', 'INFO', 'WARNING', 'ALERT']);
export type AnnouncementType = z.infer<typeof AnnouncementTypeEnum>;

export const CreateAnnouncementSchema = z.object({
  type: AnnouncementTypeEnum.optional(),
  text: z.string().min(1, 'Texto do aviso é obrigatório'),
  ctaText: z
    .string()
    .max(50, 'Texto do CTA não pode ultrapassar 50 caracteres')
    .optional()
    .nullable(),
  ctaLink: z
    .string()
    .max(255, 'Link do CTA não pode ultrapassar 255 caracteres')
    .optional()
    .nullable(),
  startDate: z.string().or(z.date()).optional().nullable(),
  endDate: z.string().or(z.date()).optional().nullable(),
  active: z.boolean().optional(),
  newsletterId: z.number().int().optional().nullable(),
});

export class CreateAnnouncementDto extends ZodDto(CreateAnnouncementSchema) {
  @ApiPropertyOptional({
    enum: ['DOC', 'INFO', 'WARNING', 'ALERT'],
    default: 'INFO',
  })
  type?: AnnouncementType;

  @ApiProperty({ example: 'Manutenção programada no servidor às 22h.' })
  text!: string;

  @ApiPropertyOptional({ example: 'Saiba mais', maxLength: 50 })
  ctaText?: string | null;

  @ApiPropertyOptional({
    example: 'https://ajuda.infobrasilsistemas.com.br',
    maxLength: 255,
  })
  ctaLink?: string | null;

  @ApiPropertyOptional({ example: '2026-10-01T00:00:00.000Z' })
  startDate?: string | Date | null;

  @ApiPropertyOptional({ example: '2026-10-31T23:59:59.000Z' })
  endDate?: string | Date | null;

  @ApiPropertyOptional({ default: true })
  active?: boolean;

  @ApiPropertyOptional({ example: 1 })
  newsletterId?: number | null;
}

export const UpdateAnnouncementSchema = CreateAnnouncementSchema.partial();

export class UpdateAnnouncementDto extends ZodDto(UpdateAnnouncementSchema) {
  @ApiPropertyOptional({ enum: ['DOC', 'INFO', 'WARNING', 'ALERT'] })
  type?: AnnouncementType;

  @ApiPropertyOptional({ example: 'Texto atualizado do aviso' })
  text?: string;

  @ApiPropertyOptional({ example: 'Clique aqui', maxLength: 50 })
  ctaText?: string | null;

  @ApiPropertyOptional({
    example: 'https://ajuda.infobrasilsistemas.com.br',
    maxLength: 255,
  })
  ctaLink?: string | null;

  @ApiPropertyOptional()
  startDate?: string | Date | null;

  @ApiPropertyOptional()
  endDate?: string | Date | null;

  @ApiPropertyOptional()
  active?: boolean;

  @ApiPropertyOptional()
  newsletterId?: number | null;
}
