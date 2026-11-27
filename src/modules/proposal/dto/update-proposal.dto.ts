import { ApiPropertyOptional } from '@nestjs/swagger';
import { ZodDto } from 'src/common/validation/zod-dto';
import {
  CreateProposalItemDto,
  CreateProposalSchema,
} from './create-proposal.dto';

export const UpdateProposalSchema = CreateProposalSchema.partial();

export class UpdateProposalDto extends ZodDto(UpdateProposalSchema) {
  @ApiPropertyOptional({ example: 2, description: 'Código do funcionário/vendedor (FUN_CODIGO)' })
  FUN_CODIGO?: number;

  @ApiPropertyOptional({ example: 1, description: 'Código da situação (SIT_CODIGO)' })
  SIT_CODIGO?: number;

  @ApiPropertyOptional({ example: 1, description: 'Código da loja (LOJ_CODIGO)' })
  LOJ_CODIGO?: number;

  @ApiPropertyOptional({ example: 10, description: 'Código do cliente (CLI_CODIGO)' })
  CLI_CODIGO?: number;

  @ApiPropertyOptional({ example: 1, description: 'Código do usuário operador (USU_CODIGO)' })
  USU_CODIGO?: number | null;

  @ApiPropertyOptional({ example: 1, description: 'Código da forma de pagamento (FPG_CODIGO)' })
  FPG_CODIGO?: number | null;

  @ApiPropertyOptional({ example: 'Sr. João', description: 'PRO_ATENCIOSAMENTE' })
  PRO_ATENCIOSAMENTE?: string | null;

  @ApiPropertyOptional({ example: '10 DIAS', description: 'PRO_PRAZO' })
  PRO_PRAZO?: string | null;

  @ApiPropertyOptional({ example: '15 DIAS', description: 'PRO_VALIDADE' })
  PRO_VALIDADE?: string | null;

  @ApiPropertyOptional({ example: '2026-11-25', description: 'PRO_DATA' })
  PRO_DATA?: string;

  @ApiPropertyOptional({ example: '14:30:00', description: 'PRO_HORA' })
  PRO_HORA?: string | null;

  @ApiPropertyOptional({ example: null, description: 'PRO_DATABAIXA' })
  PRO_DATABAIXA?: string | null;

  @ApiPropertyOptional({ example: 100, description: 'PRO_TOTALBRUTO' })
  PRO_TOTALBRUTO?: number | null;

  @ApiPropertyOptional({ example: 0, description: 'PRO_TOTALDESC' })
  PRO_TOTALDESC?: number | null;

  @ApiPropertyOptional({ example: 0, description: 'PRO_PERCDESC' })
  PRO_PERCDESC?: number | null;

  @ApiPropertyOptional({ example: 100, description: 'PRO_TOTALLIQUIDO' })
  PRO_TOTALLIQUIDO?: number | null;

  @ApiPropertyOptional({ example: 'Observação atualizada', description: 'PRO_OBS' })
  PRO_OBS?: string | null;

  @ApiPropertyOptional({ example: 2, description: 'PRO_QUANT' })
  PRO_QUANT?: number | null;

  @ApiPropertyOptional({ example: '30/60 DIAS', description: 'PRO_CONDICAOPAG' })
  PRO_CONDICAOPAG?: string | null;

  @ApiPropertyOptional({ example: 'CLIENTE FANTASIA', description: 'PRO_FANTCLI' })
  PRO_FANTCLI?: string | null;

  @ApiPropertyOptional({ example: null, description: 'PRE_CODIGO' })
  PRE_CODIGO?: number | null;

  @ApiPropertyOptional({
    example: 1,
    description: 'Tabela de preço padrão da proposta (1 a 12)',
    oneOf: [
      { type: 'integer', minimum: 1, maximum: 12 },
      { type: 'string', example: '1' },
    ],
  })
  PRO_PRECO?: string | null;

  @ApiPropertyOptional({ example: null, description: 'PRO_PEDCLIENTE' })
  PRO_PEDCLIENTE?: number | null;

  @ApiPropertyOptional({ example: null, description: 'TRA_CODIGO' })
  TRA_CODIGO?: number | null;

  @ApiPropertyOptional({ example: null, description: 'PRO_MOTIVO' })
  PRO_MOTIVO?: string | null;

  @ApiPropertyOptional({
    example: 2,
    description: 'Status da proposta (PRO_STATUS)',
    oneOf: [
      { type: 'integer', minimum: 0, maximum: 9 },
      { type: 'string', example: '2' },
    ],
  })
  PRO_STATUS?: string | null;

  @ApiPropertyOptional({ example: null, description: 'PRO_TOTALPP1' })
  PRO_TOTALPP1?: number | null;

  @ApiPropertyOptional({ example: null, description: 'PRO_TOTALPP2' })
  PRO_TOTALPP2?: number | null;

  @ApiPropertyOptional({ example: null, description: 'PRO_TOTALPP3' })
  PRO_TOTALPP3?: number | null;

  @ApiPropertyOptional({ example: null, description: 'PP1_CODIGO' })
  PP1_CODIGO?: number | null;

  @ApiPropertyOptional({ example: null, description: 'PP2_CODIGO' })
  PP2_CODIGO?: number | null;

  @ApiPropertyOptional({ example: null, description: 'PP3_CODIGO' })
  PP3_CODIGO?: number | null;

  @ApiPropertyOptional({ example: null, description: 'FP1_CODIGO' })
  FP1_CODIGO?: number | null;

  @ApiPropertyOptional({ example: null, description: 'FP2_CODIGO' })
  FP2_CODIGO?: number | null;

  @ApiPropertyOptional({ example: null, description: 'FP3_CODIGO' })
  FP3_CODIGO?: number | null;

  @ApiPropertyOptional({ example: null, description: 'PRO_NUMORG' })
  PRO_NUMORG?: number | null;

  @ApiPropertyOptional({ example: null, description: 'PRO_DATABASE1' })
  PRO_DATABASE1?: string | null;

  @ApiPropertyOptional({ example: null, description: 'PRO_DATABASE2' })
  PRO_DATABASE2?: string | null;

  @ApiPropertyOptional({ example: null, description: 'PRO_DATABASE3' })
  PRO_DATABASE3?: string | null;

  @ApiPropertyOptional({ example: null, description: 'PRO_HORABAIXA' })
  PRO_HORABAIXA?: string | null;

  @ApiPropertyOptional({ example: null, description: 'PRO_PERCDESC1' })
  PRO_PERCDESC1?: number | null;

  @ApiPropertyOptional({ example: null, description: 'PRO_PERCDESC2' })
  PRO_PERCDESC2?: number | null;

  @ApiPropertyOptional({ example: null, description: 'PRO_PERCDESC3' })
  PRO_PERCDESC3?: number | null;

  @ApiPropertyOptional({ example: null, description: 'PRO_TOTALDESC1' })
  PRO_TOTALDESC1?: number | null;

  @ApiPropertyOptional({ example: null, description: 'PRO_TOTALDESC2' })
  PRO_TOTALDESC2?: number | null;

  @ApiPropertyOptional({ example: null, description: 'PRO_TOTALDESC3' })
  PRO_TOTALDESC3?: number | null;

  @ApiPropertyOptional({ example: null, description: 'PRO_TOTALPPA1' })
  PRO_TOTALPPA1?: number | null;

  @ApiPropertyOptional({ example: null, description: 'PRO_TOTALPPA2' })
  PRO_TOTALPPA2?: number | null;

  @ApiPropertyOptional({ example: null, description: 'PRO_TOTALPPA3' })
  PRO_TOTALPPA3?: number | null;

  @ApiPropertyOptional({ example: null, description: 'PRO_INFADICIONAIS' })
  PRO_INFADICIONAIS?: string | null;

  @ApiPropertyOptional({ example: 0, description: 'PRO_PERCACRESC' })
  PRO_PERCACRESC?: number | null;

  @ApiPropertyOptional({ example: 0, description: 'PRO_TOTALACRESC' })
  PRO_TOTALACRESC?: number | null;

  @ApiPropertyOptional({ example: null, description: 'TCN_CODIGO' })
  TCN_CODIGO?: number | null;

  @ApiPropertyOptional({
    type: [CreateProposalItemDto],
    description:
      'Se informado, substitui integralmente (DELETE + INSERT atômico) todos os itens da proposta em ITENSPRO.',
  })
  ITENS?: CreateProposalItemDto[];
}
