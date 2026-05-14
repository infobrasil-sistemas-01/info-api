import { ApiPropertyOptional } from '@nestjs/swagger';
import { ZodDto } from 'src/common/validation/zod-dto';
import { z } from 'zod';

export const UpdateClientSchema = z.object({
  LOJ_CODIGO: z.number().int().optional(),
  CLI_NOME: z.string().max(60).optional(),
  CLI_FANTASIA: z.string().max(40).optional(),
  CLI_ENDERECO: z.string().max(120).optional(),
  CLI_COMPL_ENDERECO: z.string().max(40).optional(),
  CLI_CEP: z.string().max(9).optional(),
  CLI_BAIRRO: z.string().max(40).optional(),
  CLI_UF: z.string().max(2).optional(),
  CLI_FONE: z.string().max(12).optional(),
  CLI_CELULAR: z.string().max(12).optional(),
});

export class UpdateClientDto extends ZodDto(UpdateClientSchema) {
  @ApiPropertyOptional({ description: 'Código da loja', example: 1 })
  LOJ_CODIGO?: number;

  @ApiPropertyOptional({ description: 'Nome do cliente', example: 'João Silva' })
  CLI_NOME?: string;

  @ApiPropertyOptional({ description: 'Nome fantasia', example: 'João ME' })
  CLI_FANTASIA?: string;

  @ApiPropertyOptional({ description: 'Endereço', example: 'Rua ABC, 123' })
  CLI_ENDERECO?: string;

  @ApiPropertyOptional({ description: 'Complemento', example: 'Apto 101' })
  CLI_COMPL_ENDERECO?: string;

  @ApiPropertyOptional({ description: 'CEP', example: '60000-000' })
  CLI_CEP?: string;

  @ApiPropertyOptional({ description: 'Bairro', example: 'Centro' })
  CLI_BAIRRO?: string;

  @ApiPropertyOptional({ description: 'UF', example: 'CE' })
  CLI_UF?: string;

  @ApiPropertyOptional({ description: 'Telefone', example: '8533334444' })
  CLI_FONE?: string;

  @ApiPropertyOptional({ description: 'Celular', example: '85999998888' })
  CLI_CELULAR?: string;
}
