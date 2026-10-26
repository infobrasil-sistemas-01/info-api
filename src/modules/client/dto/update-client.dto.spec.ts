import { UpdateClientSchema } from './update-client.dto';

describe('UpdateClientSchema', () => {
  const completeUpdateData = {
    LOJ_CODIGO: 1,
    CLI_NOME: 'João Silva Atualizado',
    CLI_SITUACAO: 'I',
    CLI_UF: 'SP',
    MUN_CODIGO: 3550308,
    CLI_FANTASIA: 'João ME Atualizado',
    CLI_SEXO: 'M',
    CLI_ENDERECO: 'Rua Nova, 456',
    CLI_NUMERO: '456-B',
    CLI_COMPL_ENDERECO: 'Sala 202',
    CLI_CEP: '01001-000',
    CLI_BAIRRO: 'Centro',
    CLI_FONE: '1133334444',
    CLI_CELULAR: '11999998888',
    CLI_EMAIL: 'joao.novo@exemplo.com',
    CLI_DATANASC: '1990-01-15',
    CLI_CPF_CNPJ: '12345678901',
    CLI_IDENTIDADE: '1234567 SSP',
    CLI_MAE: 'Maria Silva',
    CLI_PAI: 'José Silva',
    CLI_ESTADOCIVIL: 'C',
    CLI_NATURALIDADE: 'São Paulo',
    ROT_CODIGO: 3,
  };

  test.each([
    ['empty object (no fields to update)', {}],
    ['single field update (CLI_NOME)', { CLI_NOME: 'Apenas Nome' }],
    ['number update (CLI_NUMERO)', { CLI_NUMERO: '1000' }],
    ['complete update with all fields', completeUpdateData],
    [
      'nullable fields explicitly set to null',
      {
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
    expect(() => UpdateClientSchema.parse(input)).not.toThrow();
  });

  test.each([
    ['CLI_UF longer than 2 chars', { CLI_UF: 'SPP' }],
    ['CLI_SITUACAO longer than 1 char', { CLI_SITUACAO: 'AT' }],
    ['empty CLI_NOME', { CLI_NOME: '' }],
    ['CLI_NUMERO longer than 20 chars', { CLI_NUMERO: '123456789012345678901' }],
    ['invalid MUN_CODIGO type', { MUN_CODIGO: 'invalid' }],
  ])('should reject %s', (_, input) => {
    expect(() => UpdateClientSchema.parse(input)).toThrow();
  });
});
