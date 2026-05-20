import { ApiProperty } from '@nestjs/swagger';
import { ZodDto } from 'src/common/validation/zod-dto';
import { z } from 'zod';

const HostingTypeEnum = z.enum(['DATACENTER', 'CLIENT_SERVER']);

export const CreateIntegrationRequestSchema = z.object({
  clientName: z.string().min(3, 'Nome do cliente muito curto'),
  legalName: z.string().min(3, 'Razão social muito curta'),
  cnpj: z.string().optional(),
  hostingType: HostingTypeEnum,
  fixedIp: z.string().optional(),
  database: z.object({
    host: z.string(),
    port: z.number(),
    database: z.string(),
  }),
  stores: z.array(z.number()),
  modules: z.array(z.string()).min(1, 'Selecione ao menos um módulo'),
  scopes: z.array(
    z.object({
      resource: z.string(),
      actions: z.array(z.enum(['read', 'create', 'update', 'delete'])),
    }),
  ),
  objective: z.string().min(10, 'Objetivo muito curto'),
  technicalContact: z.object({
    name: z.string(),
    email: z.string().email('E-mail inválido'),
    phone: z.string(),
  }),
  responsiblePerson: z.object({
    name: z.string(),
    email: z.string().email('E-mail inválido'),
    phone: z.string(),
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

  @ApiProperty({ enum: ['DATACENTER', 'CLIENT_SERVER'] })
  hostingType!: 'DATACENTER' | 'CLIENT_SERVER';

  @ApiProperty({ required: false, example: '187.1.2.3' })
  fixedIp?: string;

  @ApiProperty({
    example: { host: 'localhost', port: 3050, database: 'C:\\BASE.FDB' },
  })
  database!: {
    host: string;
    port: number;
    database: string;
  };

  @ApiProperty({ example: [1, 2, 3] })
  stores!: number[];

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
