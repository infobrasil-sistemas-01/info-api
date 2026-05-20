import { ApiProperty } from '@nestjs/swagger';

export class SupplierResponseDto {
  @ApiProperty({ example: 1, description: 'Código do fornecedor' })
  CRE_CODIGO: number;

  @ApiProperty({
    example: 'Fornecedor Exemplo LTDA',
    description: 'Razão social ou nome',
  })
  CRE_NOME: string;

  @ApiProperty({ example: 'Fornecedor Exemplo', description: 'Nome fantasia' })
  CRE_FANTASIA: string;

  @ApiProperty({ example: 'Av. Brasil, 1500', description: 'Endereço' })
  CRE_ENDERECO: string;

  @ApiProperty({ example: 'Jardim Paulista', description: 'Bairro' })
  CRE_BAIRRO: string;

  @ApiProperty({ example: 'SP', description: 'UF' })
  CRE_UF: string;

  @ApiProperty({ example: 'Carlos', description: 'Contato principal' })
  CRE_CONTATO: string;

  @ApiProperty({ example: '01431-000', description: 'CEP' })
  CRE_CEP: string;

  @ApiProperty({ example: '12.345.678/0001-90', description: 'CNPJ' })
  CRE_CNPJ: string;

  @ApiProperty({
    example: '123456789',
    description: 'Inscrição Estadual (CGF)',
  })
  CRE_CGF: string;

  @ApiProperty({ example: '1133334444', description: 'Telefone' })
  CRE_FONE: string;

  @ApiProperty({ example: '11999998888', description: 'Celular' })
  CRE_CELULAR: string;

  @ApiProperty({ example: '1133334445', description: 'Fax' })
  CRE_FAX: string;

  @ApiProperty({ example: '0800-123-456', description: 'Telefone 0800' })
  CRE_ZEROOITO: string;

  @ApiProperty({ example: 'contato@fornecedor.com', description: 'E-mail' })
  CRE_EMAIL: string;

  @ApiProperty({ example: 'www.fornecedor.com.br', description: 'Site' })
  CRE_SITE: string;

  @ApiProperty({
    example: 'Representante Zé',
    description: 'Nome do representante',
  })
  CRE_REPRESENTANTE: string;

  @ApiProperty({
    example: '1133334444',
    description: 'Telefone do representante',
  })
  CRE_FONEREP: string;

  @ApiProperty({
    example: '11988887777',
    description: 'Celular do representante',
  })
  CRE_CELULARREP: string;

  @ApiProperty({
    example: 'rep@fornecedor.com',
    description: 'E-mail do representante',
  })
  CRE_EMAILREP: string;

  @ApiProperty({
    example: 'A',
    description: 'Situação (A = Ativo, I = Inativo)',
  })
  CRE_SITUACAO: string;

  @ApiProperty({ example: 1, description: 'Código da loja' })
  LOJ_CODIGO: number;
}

export class SupplierDetailResponseDto extends SupplierResponseDto {}
