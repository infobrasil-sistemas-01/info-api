import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ZodDto } from 'src/common/validation/zod-dto';
import { z } from 'zod';

export const AbcCurveGroupByEnum = z.enum([
  'SELLER',
  'STORE',
  'GROUP',
  'BRAND',
  'CUSTOMER',
  'PRODUCT',
]);
export type AbcCurveGroupBy = z.infer<typeof AbcCurveGroupByEnum>;

export const AbcCurveOrderByEnum = z.enum(['NAME', 'VALUE', 'QUANTITY']);
export type AbcCurveOrderBy = z.infer<typeof AbcCurveOrderByEnum>;

export const AbcCurveOrderDirectionEnum = z.enum(['ASC', 'DESC']);
export type AbcCurveOrderDirection = z.infer<typeof AbcCurveOrderDirectionEnum>;

export const AbcCurveSystemEnum = z.enum(['PED', 'PDV', 'ALL']);
export type AbcCurveSystem = z.infer<typeof AbcCurveSystemEnum>;

export const GetAbcCurveQuerySchema = z
  .object({
    startDate: z
      .string({ message: 'A data inicial (startDate) é obrigatória.' })
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'startDate deve estar no formato YYYY-MM-DD'),
    endDate: z
      .string({ message: 'A data final (endDate) é obrigatória.' })
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'endDate deve estar no formato YYYY-MM-DD'),
    groupBy: AbcCurveGroupByEnum.optional(),
    storeId: z.coerce.number().int().positive().optional(),
    system: AbcCurveSystemEnum.optional(),
    situation: z.coerce.number().int().optional(),
    orderBy: AbcCurveOrderByEnum.optional(),
    orderDirection: AbcCurveOrderDirectionEnum.optional(),
    page: z.coerce.number().int().min(1).optional(),
    pageSize: z.coerce.number().int().min(1).max(100).optional(),
  })
  .refine(
    (data) => {
      return data.startDate <= data.endDate;
    },
    {
      message: 'startDate não pode ser posterior a endDate',
      path: ['startDate'],
    },
  )
  .refine(
    (data) => {
      const isHighCardinality =
        data.groupBy === 'CUSTOMER' || data.groupBy === 'PRODUCT';
      if (isHighCardinality) {
        return data.page !== undefined && data.pageSize !== undefined;
      }
      return true;
    },
    {
      message:
        "Para agrupamentos de alta cardinalidade ('CUSTOMER' e 'PRODUCT'), os parâmetros 'page' e 'pageSize' (máx: 100) são obrigatórios para evitar degradação de I/O no banco Firebird.",
      path: ['groupBy'],
    },
  );

export class GetAbcCurveQueryDto extends ZodDto(GetAbcCurveQuerySchema) {
  @ApiProperty({
    description: 'Data inicial no formato YYYY-MM-DD',
    example: '2026-01-22',
  })
  startDate: string;

  @ApiProperty({
    description: 'Data final no formato YYYY-MM-DD',
    example: '2026-10-22',
  })
  endDate: string;

  @ApiPropertyOptional({
    description:
      'Dimensão para agrupamento da curva (SELLER, STORE, GROUP, BRAND, CUSTOMER, PRODUCT)',
    enum: ['SELLER', 'STORE', 'GROUP', 'BRAND', 'CUSTOMER', 'PRODUCT'],
    default: 'SELLER',
    example: 'SELLER',
  })
  groupBy?: AbcCurveGroupBy;

  @ApiPropertyOptional({
    description: 'Código da loja/filial no ERP',
    example: 1,
  })
  storeId?: number;

  @ApiPropertyOptional({
    description: 'Sistema de origem das vendas (PED: Retaguarda, PDV: Frente de caixa, ALL: Ambos)',
    enum: ['PED', 'PDV', 'ALL'],
    default: 'PED',
    example: 'PED',
  })
  system?: AbcCurveSystem;

  @ApiPropertyOptional({
    description: 'Código da situação da venda no ERP (padrão: 2 - Fechada/Faturada)',
    default: 2,
    example: 2,
  })
  situation?: number;

  @ApiPropertyOptional({
    description: 'Critério de ordenação das linhas da curva (NAME, VALUE, QUANTITY)',
    enum: ['NAME', 'VALUE', 'QUANTITY'],
    default: 'NAME',
    example: 'NAME',
  })
  orderBy?: AbcCurveOrderBy;

  @ApiPropertyOptional({
    description: 'Direção da ordenação (ASC, DESC)',
    enum: ['ASC', 'DESC'],
    example: 'ASC',
  })
  orderDirection?: AbcCurveOrderDirection;

  @ApiPropertyOptional({
    description:
      'Número da página (obrigatório para CUSTOMER e PRODUCT; opcional para as demais)',
    example: 1,
  })
  page?: number;

  @ApiPropertyOptional({
    description:
      'Quantidade de registros por página (máx: 100; obrigatório para CUSTOMER e PRODUCT)',
    example: 50,
  })
  pageSize?: number;
}
