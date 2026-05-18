import { ApiProperty } from '@nestjs/swagger';
import { ZodDto } from 'src/common/validation/zod-dto';
import { z } from 'zod';

export const SendNewsletterSchema = z.object({
  announcementIds: z.array(z.string().uuid()).min(1, 'Selecione ao menos um aviso'),
  subject: z.string().min(3, 'Assunto muito curto'),
  initialMessage: z.string().optional().nullable(),
  finalMessage: z.string().optional().nullable(),
});

export class SendNewsletterDto extends ZodDto(SendNewsletterSchema) {
  @ApiProperty({ example: ['47ef5c20-7f2a-4db3-9824-2c6c39bb7f1a'] })
  announcementIds!: string[];

  @ApiProperty({ example: 'InfoAPI News #1' })
  subject!: string;

  @ApiProperty({ required: false, example: 'Olá! Veja o que mudou...' })
  initialMessage?: string | null;

  @ApiProperty({ required: false, example: 'Ficou com alguma dúvida? Fale conosco.' })
  finalMessage?: string | null;
}
