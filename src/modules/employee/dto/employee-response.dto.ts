import { ApiProperty } from '@nestjs/swagger';

export class EmployeeResponseDto {
  @ApiProperty({ example: 1, description: 'Código do funcionário' })
  FUN_CODIGO: number;

  @ApiProperty({ example: 'João da Silva', description: 'Nome do funcionário' })
  FUN_NOME: string;

  @ApiProperty({ example: 'João', description: 'Apelido do funcionário' })
  FUN_APELIDO: string;

  @ApiProperty({ example: 'Rua das Flores, 123', description: 'Endereço do funcionário' })
  FUN_ENDERECO: string;

  @ApiProperty({ example: 'Centro', description: 'Bairro' })
  FUN_BAIRRO: string;

  @ApiProperty({ example: 'São Paulo', description: 'Cidade' })
  FUN_CIDADE: string;

  @ApiProperty({ example: 'SP', description: 'UF' })
  FUN_UF: string;

  @ApiProperty({ example: '01000-000', description: 'CEP' })
  FUN_CEP: string;

  @ApiProperty({ example: '1133334444', description: 'Telefone' })
  FUN_FONE: string;

  @ApiProperty({ example: '11999998888', description: 'Celular' })
  FUN_CELULAR: string;

  @ApiProperty({ example: 'joao@email.com', description: 'E-mail' })
  FUN_EMAIL: string;

  @ApiProperty({ example: '123.456.789-00', description: 'CPF' })
  FUN_CPF: string;

  @ApiProperty({ example: '12.345.678-9', description: 'Identidade (RG)' })
  FUN_IDENTIDADE: string;

  @ApiProperty({ example: 'A', description: 'Situação (A = Ativo, I = Inativo)' })
  FUN_SITUACAO: string;

  @ApiProperty({ example: '1990-01-01', description: 'Data de nascimento' })
  FUN_DATANASC: Date;

  @ApiProperty({ example: '2020-01-01', description: 'Data de admissão' })
  FUN_DATAADMISSAO: Date;

  @ApiProperty({ example: null, description: 'Data de demissão' })
  FUN_DATADEMISSAO: Date;

  @ApiProperty({ example: 1, description: 'Código da loja associada' })
  LOJ_CODIGO: number;
}

export class EmployeeDetailResponseDto extends EmployeeResponseDto {
}
