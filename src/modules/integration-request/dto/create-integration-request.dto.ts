import { ApiProperty } from '@nestjs/swagger';
import { ZodDto } from 'src/common/validation/zod-dto';
import { z } from 'zod';

const HostingTypeEnum = z.enum(['DATACENTER', 'CLIENT_SERVER']);

export const CreateIntegrationRequestSchema = z.object({
  clientName: z
    .string()
    .min(3, 'Nome do cliente muito curto')
    .max(255, 'Nome do cliente não pode ultrapassar 255 caracteres'),
  legalName: z
    .string()
    .min(3, 'Razão social muito curta')
    .max(255, 'Razão social não pode ultrapassar 255 caracteres'),
  cnpj: z
    .string()
    .max(20, 'CNPJ não pode ultrapassar 20 caracteres')
    .optional(),
  hostingType: HostingTypeEnum.optional(),
  fixedIp: z
    .string()
    .max(45, 'IP fixo não pode ultrapassar 45 caracteres')
    .optional(),
  database: z
    .object({
      host: z.string().max(255),
      port: z.number(),
      database: z.string().max(255),
    })
    .optional(),
  modules: z.array(z.string()).min(1, 'Selecione ao menos um módulo'),
  scopes: z.array(
    z.object({
      resource: z.string().max(100),
      actions: z.array(z.enum(['read', 'create', 'update', 'delete'])),
    }),
  ),
  objective: z
    .string()
    .min(10, 'Objetivo muito curto')
    .max(5000, 'Objetivo não pode ultrapassar 5.000 caracteres'),
  technicalContact: z.object({
    name: z.string().max(255),
    email: z.string().email('E-mail inválido').max(255),
    phone: z.string().max(50),
  }),
  responsiblePerson: z.object({
    name: z.string().max(255),
    email: z.string().email('E-mail inválido').max(255),
    phone: z.string().max(50),
  }),
});

export class CreateIntegrationRequestDto extends ZodDto(
  CreateIntegrationRequestSchema,
) {
  @ApiProperty({ example: 'Cliente Exemplo' })
  clientName!: string;

  @ApiProperty({ example: 'Empresa Exemplo LTDA' })
  legalName!: string;

  @ApiProperty({ required: false, example: '00.000.000/0000-00' })
  cnpj?: string;

  @ApiProperty({ required: false, enum: ['DATACENTER', 'CLIENT_SERVER'] })
  hostingType?: 'DATACENTER' | 'CLIENT_SERVER';

  @ApiProperty({ required: false, example: '187.1.2.3' })
  fixedIp?: string;

  @ApiProperty({
    required: false,
    example: { host: 'localhost', port: 3050, database: 'C:\\BASE.FDB' },
  })
  database?: {
    host: string;
    port: number;
    database: string;
  };

  @ApiProperty({ example: ['Estoque', 'Financeiro'] })
  modules!: string[];

  @ApiProperty({
    example: [{ resource: 'products', actions: ['read', 'create'] }],
  })
  scopes!: {
    resource: string;
    actions: ('read' | 'create' | 'update' | 'delete')[];
  }[];

  @ApiProperty({
    example: 'Integração com ERP externo para sincronia de estoque',
  })
  objective!: string;

  @ApiProperty({
    example: {
      name: 'João Silva',
      email: 'joao@cliente.com',
      phone: '11999999999',
    },
  })
  technicalContact!: {
    name: string;
    email: string;
    phone: string;
  };

  @ApiProperty({
    example: {
      name: 'Maria Souza',
      email: 'maria@cliente.com',
      phone: '11888888888',
    },
  })
  responsiblePerson!: {
    name: string;
    email: string;
    phone: string;
  };
}
