import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ZodDto } from 'src/common/validation/zod-dto';
import { z } from 'zod';

export const CreateClientSchema = z.object({
  LOJ_CODIGO: z.number().int().default(1),
  CLI_NOME: z.string().max(60),
  CLI_FANTASIA: z.string().max(40).optional(),
  CLI_ENDERECO: z.string().max(120).optional(),
  CLI_COMPL_ENDERECO: z.string().max(40).optional(),
  CLI_CEP: z.string().max(9).optional(),
  CLI_BAIRRO: z.string().max(40).optional(),
  CLI_UF: z.string().max(2).default('CE'),
  CLI_FONE: z.string().max(12).optional(),
  CLI_CELULAR: z.string().max(12).optional(),
  CLI_CPF_CNPJ: z.string().max(14).optional(),
});

export class CreateClientDto extends ZodDto(CreateClientSchema) {
  @ApiProperty({ description: 'Código da loja', example: 1, default: 1 })
  LOJ_CODIGO: number;

  @ApiProperty({ description: 'Nome do cliente', example: 'João Silva' })
  CLI_NOME: string;

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

  @ApiProperty({ description: 'UF', example: 'CE', default: 'CE' })
  CLI_UF: string;

  @ApiPropertyOptional({ description: 'Telefone', example: '8533334444' })
  CLI_FONE?: string;

  @ApiPropertyOptional({ description: 'Celular', example: '85999998888' })
  CLI_CELULAR?: string;

  @ApiPropertyOptional({ description: 'CPF ou CNPJ', example: '12345678901' })
  CLI_CPF_CNPJ?: string;
}
