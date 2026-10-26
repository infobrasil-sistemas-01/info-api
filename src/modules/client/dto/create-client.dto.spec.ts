import { CreateClientSchema } from './create-client.dto';

describe('CreateClientSchema', () => {
  const minimalValidData = {
    LOJ_CODIGO: 1,
    CLI_NOME: 'João Silva',
    CLI_SITUACAO: 'A',
    CLI_UF: 'CE',
    MUN_CODIGO: 2302404,
  };

  const completeValidData = {
    ...minimalValidData,
    CLI_FANTASIA: 'João ME',
    CLI_SEXO: 'M',
    CLI_ENDERECO: 'Rua das Flores, 123',
    CLI_NUMERO: '123',
    CLI_COMPL_ENDERECO: 'Sala 101',
    CLI_CEP: '60000-000',
    CLI_BAIRRO: 'Centro',
    CLI_FONE: '8533334444',
    CLI_CELULAR: '85999998888',
    CLI_EMAIL: 'joao@exemplo.com',
    CLI_DATANASC: '1990-01-15',
    CLI_CPF_CNPJ: '12345678901',
    CLI_IDENTIDADE: '1234567 SSP',
    CLI_MAE: 'Maria Silva',
    CLI_PAI: 'José Silva',
    CLI_ESTADOCIVIL: 'S',
    CLI_NATURALIDADE: 'Fortaleza',
    ROT_CODIGO: 2,
  };

  test.each([
    ['minimal valid data with required fields', minimalValidData],
    ['complete valid data with all fields', completeValidData],
    [
      'minimal valid data with explicit nulls for optional fields',
      {
        ...minimalValidData,
        CLI_FANTASIA: null,
        CLI_SEXO: null,
        CLI_ENDERECO: null,
        CLI_NUMERO: null,
        CLI_COMPL_ENDERECO: null,
        CLI_CEP: null,
        CLI_BAIRRO: null,
        CLI_FONE: null,
        CLI_CELULAR: null,
        CLI_EMAIL: null,
        CLI_DATANASC: null,
        CLI_CPF_CNPJ: null,
        CLI_IDENTIDADE: null,
        CLI_MAE: null,
        CLI_PAI: null,
        CLI_ESTADOCIVIL: null,
        CLI_NATURALIDADE: null,
        ROT_CODIGO: null,
      },
    ],
  ])('should accept %s', (_, input) => {
    expect(() => CreateClientSchema.parse(input)).not.toThrow();
  });

  test.each([
    ['missing LOJ_CODIGO', { ...minimalValidData, LOJ_CODIGO: undefined }],
    ['missing CLI_NOME', { ...minimalValidData, CLI_NOME: undefined }],
    ['missing CLI_SITUACAO', { ...minimalValidData, CLI_SITUACAO: undefined }],
    ['missing CLI_UF', { ...minimalValidData, CLI_UF: undefined }],
    ['missing MUN_CODIGO', { ...minimalValidData, MUN_CODIGO: undefined }],
    ['empty CLI_NOME', { ...minimalValidData, CLI_NOME: '' }],
    ['CLI_UF longer than 2 chars', { ...minimalValidData, CLI_UF: 'CEU' }],
    [
      'CLI_SITUACAO longer than 1 char',
      { ...minimalValidData, CLI_SITUACAO: 'AT' },
    ],
  ])('should reject %s', (_, input) => {
    expect(() => CreateClientSchema.parse(input)).toThrow();
  });
});
