import { ApiPropertyOptional } from '@nestjs/swagger';
import { ZodDto } from 'src/common/validation/zod-dto';
import { z } from 'zod';

export const PurchaseQuerySchema = z.object({
  page: z.coerce.number().min(1).optional(),
  pageSize: z.coerce.number().min(1).optional(),
  storeId: z.coerce.number().optional(),
  supplierId: z.coerce.number().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  invoiceNumber: z.string().optional(),
  nfeKey: z.string().optional(),
});

export class PurchaseQueryDto extends ZodDto(PurchaseQuerySchema) {
  @ApiPropertyOptional({
    description: 'Página atual',
    default: 1,
    type: Number,
  })
  page?: number;

  @ApiPropertyOptional({
    description: 'Registros por página',
    default: 10,
    type: Number,
  })
  pageSize?: number;

  @ApiPropertyOptional({
    description: 'Código da loja (LOJ_CODIGO)',
    type: Number,
  })
  storeId?: number;

  @ApiPropertyOptional({
    description: 'Código do fornecedor/credor (CRE_CODIGO)',
    type: Number,
  })
  supplierId?: number;

  @ApiPropertyOptional({
    description: 'Data de entrada inicial (YYYY-MM-DD)',
    type: String,
  })
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Data de entrada final (YYYY-MM-DD)',
    type: String,
  })
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Número da nota fiscal (COM_NUMERONF)',
    type: String,
  })
  invoiceNumber?: string;

  @ApiPropertyOptional({
    description: 'Chave de acesso da NF-e (COM_CHAVE - 44 dígitos)',
    type: String,
  })
  nfeKey?: string;
}
