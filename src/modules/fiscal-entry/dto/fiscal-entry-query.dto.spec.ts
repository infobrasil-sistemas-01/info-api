import { FiscalEntryQuerySchema } from './fiscal-entry-query.dto';

describe('FiscalEntryQueryDto Schema Validation', () => {
  const validData = {
    page: 1,
    pageSize: 10,
    storeId: 1,
    supplierId: 100,
    startDate: '2026-01-01',
    endDate: '2026-01-31',
    invoiceNumber: '123456',
    nfeKey: '23260812345678000195550010001234561001234567',
  };

  test.each([
    ['dados válidos completos', validData],
    ['apenas paginação', { page: 2, pageSize: 20 }],
    ['campos vazios/opcionais', {}],
    ['strings numéricas coercíveis', { page: '3', pageSize: '15', storeId: '2', supplierId: '50' }],
    ['filtro por chave NF-e', { nfeKey: '12345' }],
  ])('deve aceitar %s', (_, input) => {
    expect(() => FiscalEntryQuerySchema.parse(input)).not.toThrow();
  });

  test.each([
    ['page zero ou negativo', { page: 0 }],
    ['page negativo', { page: -5 }],
    ['pageSize zero', { pageSize: 0 }],
    ['page inválido (não numérico)', { page: 'abc' }],
    ['storeId inválido (não numérico)', { storeId: 'loja_x' }],
  ])('deve rejeitar %s', (_, input) => {
    expect(() => FiscalEntryQuerySchema.parse(input)).toThrow();
  });
});
