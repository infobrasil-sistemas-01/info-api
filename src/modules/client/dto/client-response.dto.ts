import { ApiProperty } from '@nestjs/swagger';

export class ClientResponseDto {
  @ApiProperty({ example: 1, description: 'Código do cliente' })
  CLI_CODIGO: number;

  @ApiProperty({
    example: 'A',
    description: 'Situação (A = Ativo, I = Inativo)',
  })
  CLI_SITUACAO: string;

  @ApiProperty({
    example: 'Maria de Souza',
    description: 'Nome ou razão social',
  })
  CLI_NOME: string;

  @ApiProperty({
    example: 'Mariazinha',
    description: 'Nome fantasia ou apelido',
  })
  CLI_FANTASIA: string;

  @ApiProperty({ example: 'F', description: 'Sexo (M, F, O)' })
  CLI_SEXO: string;

  @ApiProperty({
    example: 'Av. Paulista, 1000',
    description: 'Endereço principal',
  })
  CLI_ENDERECO: string;

  @ApiProperty({ example: '11988887777', description: 'Telefone' })
  CLI_FONE: string;

  @ApiProperty({ example: 'maria@exemplo.com', description: 'E-mail' })
  CLI_EMAIL: string;

  @ApiProperty({ example: '1985-05-20', description: 'Data de nascimento' })
  CLI_DATANASC: Date;
}

export class ClientDetailResponseDto extends ClientResponseDto {
  @ApiProperty({ example: 'Apto 101', description: 'Complemento do endereço' })
  CLI_COMPL_ENDERECO: string;

  @ApiProperty({ example: '01310-100', description: 'CEP' })
  CLI_CEP: string;

  @ApiProperty({ example: 'Bela Vista', description: 'Bairro' })
  CLI_BAIRRO: string;

  @ApiProperty({ example: 'SP', description: 'UF' })
  CLI_UF: string;

  @ApiProperty({ example: '111.222.333-44', description: 'CPF ou CNPJ' })
  CLI_CPF_CNPJ: string;

  @ApiProperty({ example: '12.345.678-9', description: 'Identidade (RG)' })
  CLI_IDENTIDADE: string;

  @ApiProperty({ example: 'Ana de Souza', description: 'Nome da mãe' })
  CLI_MAE: string;

  @ApiProperty({ example: 'João de Souza', description: 'Nome do pai' })
  CLI_PAI: string;

  @ApiProperty({ example: 'Solteiro(a)', description: 'Estado civil' })
  CLI_ESTADOCIVIL: string;

  @ApiProperty({ example: 'São Paulo - SP', description: 'Naturalidade' })
  CLI_NATURALIDADE: string;
}
