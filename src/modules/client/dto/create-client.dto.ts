import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ZodDto } from 'src/common/validation/zod-dto';
import { z } from 'zod';

export const CreateClientSchema = z.object({
  LOJ_CODIGO: z.number().int(),
  CLI_NOME: z.string().min(1).max(60),
  CLI_SITUACAO: z.string().min(1).max(1),
  CLI_UF: z.string().min(1).max(2),
  MUN_CODIGO: z.number().int(),
  CLI_FANTASIA: z.string().max(40).optional().nullable(),
  CLI_SEXO: z.string().max(1).optional().nullable(),
  CLI_ENDERECO: z.string().max(120).optional().nullable(),
  CLI_NUMERO: z.string().max(20).optional().nullable(),
  CLI_COMPL_ENDERECO: z.string().max(40).optional().nullable(),
  CLI_CEP: z.string().max(9).optional().nullable(),
  CLI_BAIRRO: z.string().max(40).optional().nullable(),
  CLI_FONE: z.string().max(12).optional().nullable(),
  CLI_CELULAR: z.string().max(12).optional().nullable(),
  CLI_EMAIL: z.string().max(200).optional().nullable(),
  CLI_DATANASC: z.string().optional().nullable(),
  CLI_CPF_CNPJ: z.string().max(14).optional().nullable(),
  CLI_IDENTIDADE: z.string().max(40).optional().nullable(),
  CLI_MAE: z.string().max(40).optional().nullable(),
  CLI_PAI: z.string().max(40).optional().nullable(),
  CLI_ESTADOCIVIL: z.string().max(1).optional().nullable(),
  CLI_NATURALIDADE: z.string().max(25).optional().nullable(),
  ROT_CODIGO: z.number().int().optional().nullable(),
});

export class CreateClientDto extends ZodDto(CreateClientSchema) {
  @ApiProperty({ description: 'Código da loja', example: 1 })
  LOJ_CODIGO: number;

  @ApiProperty({ description: 'Nome do cliente', example: 'João Silva' })
  CLI_NOME: string;

  @ApiProperty({
    description: 'Situação do cliente (A = Ativo, I = Inativo)',
    example: 'A',
  })
  CLI_SITUACAO: string;

  @ApiProperty({ description: 'UF', example: 'CE' })
  CLI_UF: string;

  @ApiProperty({
    description:
      'Código IBGE do município (consulte GET /cities para listar municípios válidos)',
    example: 2302404,
  })
  MUN_CODIGO: number;

  @ApiPropertyOptional({ description: 'Nome fantasia', example: 'João ME' })
  CLI_FANTASIA?: string | null;

  @ApiPropertyOptional({ description: 'Sexo (M, F, O)', example: 'M' })
  CLI_SEXO?: string | null;

  @ApiPropertyOptional({ description: 'Endereço', example: 'Rua ABC, 123' })
  CLI_ENDERECO?: string | null;

  @ApiPropertyOptional({ description: 'Número do endereço', example: '123' })
  CLI_NUMERO?: string | null;

  @ApiPropertyOptional({ description: 'Complemento', example: 'Apto 101' })
  CLI_COMPL_ENDERECO?: string | null;

  @ApiPropertyOptional({ description: 'CEP', example: '60000-000' })
  CLI_CEP?: string | null;

  @ApiPropertyOptional({ description: 'Bairro', example: 'Centro' })
  CLI_BAIRRO?: string | null;

  @ApiPropertyOptional({ description: 'Telefone', example: '8533334444' })
  CLI_FONE?: string | null;

  @ApiPropertyOptional({ description: 'Celular', example: '85999998888' })
  CLI_CELULAR?: string | null;

  @ApiPropertyOptional({ description: 'E-mail', example: 'joao@exemplo.com' })
  CLI_EMAIL?: string | null;

  @ApiPropertyOptional({
    description: 'Data de nascimento (YYYY-MM-DD)',
    example: '1990-01-15',
  })
  CLI_DATANASC?: string | null;

  @ApiPropertyOptional({ description: 'CPF ou CNPJ', example: '12345678901' })
  CLI_CPF_CNPJ?: string | null;

  @ApiPropertyOptional({ description: 'Identidade (RG)', example: '1234567' })
  CLI_IDENTIDADE?: string | null;

  @ApiPropertyOptional({ description: 'Nome da mãe', example: 'Maria Silva' })
  CLI_MAE?: string | null;

  @ApiPropertyOptional({ description: 'Nome do pai', example: 'José Silva' })
  CLI_PAI?: string | null;

  @ApiPropertyOptional({
    description: 'Estado civil (ex: S, C, D, V, O)',
    example: 'S',
  })
  CLI_ESTADOCIVIL?: string | null;

  @ApiPropertyOptional({
    description: 'Naturalidade',
    example: 'Fortaleza - CE',
  })
  CLI_NATURALIDADE?: string | null;

  @ApiPropertyOptional({ description: 'Código da rota', example: 1 })
  ROT_CODIGO?: number | null;
}
