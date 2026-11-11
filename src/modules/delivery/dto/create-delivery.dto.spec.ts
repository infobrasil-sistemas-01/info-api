import {
  CreateDeliveryItemSchema,
  CreateDeliverySchema,
} from './create-delivery.dto';

describe('CreateDeliveryItemSchema', () => {
  const validItem = {
    PRO_CODIGO: 'PROD-123',
    ETI_QTDE: 2,
  };

  test.each([
    ['valid item without IVD_NUMERO', validItem],
    [
      'valid item with optional fields',
      {
        ...validItem,
        ETI_QTDECLIENTE: 2,
        ETI_IMPRIMIR: 'S' as const,
        USU_CODIGO: 9999,
      },
    ],
  ])('should accept %s', (_, input) => {
    expect(() => CreateDeliveryItemSchema.parse(input)).not.toThrow();
  });

  test.each([
    ['missing PRO_CODIGO', { ETI_QTDE: 2 }],
    ['empty PRO_CODIGO', { PRO_CODIGO: '', ETI_QTDE: 2 }],
    ['zero ETI_QTDE', { PRO_CODIGO: 'PROD-123', ETI_QTDE: 0 }],
    ['negative ETI_QTDE', { PRO_CODIGO: 'PROD-123', ETI_QTDE: -1 }],
  ])('should reject %s', (_, input) => {
    expect(() => CreateDeliveryItemSchema.parse(input)).toThrow();
  });
});

describe('CreateDeliverySchema', () => {
  const validDelivery = {
    VEN_NUMERO: 12345,
    items: [
      {
        PRO_CODIGO: 'PROD-123',
        ETI_QTDE: 2,
      },
    ],
  };

  test.each([
    ['valid delivery with items without IVD_NUMERO', validDelivery],
    ['valid delivery without items', { VEN_NUMERO: 12345 }],
  ])('should accept %s', (_, input) => {
    expect(() => CreateDeliverySchema.parse(input)).not.toThrow();
  });

  test.each([
    ['missing VEN_NUMERO', {}],
    ['invalid VEN_NUMERO', { VEN_NUMERO: 0 }],
  ])('should reject %s', (_, input) => {
    expect(() => CreateDeliverySchema.parse(input)).toThrow();
  });
});

