import { ApiProperty } from '@nestjs/swagger';

export class ServiceProviderResponseDto {
  @ApiProperty({ example: 1, description: 'Código do prestador' })
  PRE_CODIGO: number;

  @ApiProperty({ example: 'João Silva', description: 'Nome do prestador' })
  PRE_NOME: string;

  @ApiProperty({ example: 'Joãozinho', description: 'Apelido do prestador' })
  PRE_APELIDO: string;

  @ApiProperty({ example: 'Rua Exemplo, 123', description: 'Endereço do prestador' })
  PRE_ENDERECO: string;

  @ApiProperty({ example: '1144445555', description: 'Telefone do prestador' })
  PRE_FONE: string;

  @ApiProperty({ example: '11999998888', description: 'Celular do prestador' })
  PRE_CELULAR: string;

  @ApiProperty({ example: 'joao@exemplo.com', description: 'E-mail do prestador' })
  PRE_EMAIL: string;

  @ApiProperty({ example: 'A', description: 'Situação do prestador (A = Ativo, I = Inativo)' })
  PRE_SITUACAO: string;

  @ApiProperty({ example: 1, description: 'Código da loja associada' })
  LOJ_CODIGO: number;
}

export class ServiceProviderDetailResponseDto {
  @ApiProperty({ example: 1, description: 'Código do prestador' })
  PRE_CODIGO: number;

  @ApiProperty({ example: 'João Silva', description: 'Nome do prestador' })
  PRE_NOME: string;

  @ApiProperty({ example: 'Joãozinho', description: 'Apelido do prestador' })
  PRE_APELIDO: string;

  @ApiProperty({ example: 'Rua Exemplo, 123', description: 'Endereço do prestador' })
  PRE_ENDERECO: string;

  @ApiProperty({ example: 'Centro', description: 'Bairro do prestador' })
  PRE_BAIRRO: string;

  @ApiProperty({ example: 'São Paulo', description: 'Cidade do prestador' })
  PRE_CIDADE: string;

  @ApiProperty({ example: 'SP', description: 'UF (Estado) do prestador' })
  PRE_UF: string;

  @ApiProperty({ example: '01000-000', description: 'CEP do prestador' })
  PRE_CEP: string;

  @ApiProperty({ example: '1144445555', description: 'Telefone do prestador' })
  PRE_FONE: string;

  @ApiProperty({ example: '11999998888', description: 'Celular do prestador' })
  PRE_CELULAR: string;

  @ApiProperty({ example: 'joao@exemplo.com', description: 'E-mail do prestador' })
  PRE_EMAIL: string;

  @ApiProperty({ example: '123.456.789-00', description: 'CPF do prestador' })
  PRE_CPF: string;

  @ApiProperty({ example: '12.345.678-9', description: 'Identidade (RG) do prestador' })
  PRE_IDENTIDADE: string;

  @ApiProperty({ example: 'A', description: 'Situação do prestador (A = Ativo, I = Inativo)' })
  PRE_SITUACAO: string;

  @ApiProperty({ example: 1, description: 'Código da loja associada' })
  LOJ_CODIGO: number;
}
