import { extractIncludeCountFromRequest } from './include-count.decorator';

describe('extractIncludeCountFromRequest', () => {
  it('deve retornar false quando headers não existirem ou x-request-count estiver ausente', () => {
    expect(extractIncludeCountFromRequest(null)).toBe(false);
    expect(extractIncludeCountFromRequest({})).toBe(false);
    expect(extractIncludeCountFromRequest({ headers: {} })).toBe(false);
  });

  test.each([
    ['true', true],
    ['TRUE', true],
    [' True ', true],
    ['1', true],
    ['yes', true],
    ['YES', true],
    ['false', false],
    ['0', false],
    ['no', false],
    ['anything_else', false],
    ['', false],
  ])('para header x-request-count = "%s", deve retornar %s', (input, expected) => {
    const req = {
      headers: {
        'x-request-count': input,
      },
    };
    expect(extractIncludeCountFromRequest(req)).toBe(expected);
  });

  it('deve lidar com arrays de headers (se o proxy/framework passar array)', () => {
    const req = {
      headers: {
        'x-request-count': ['true', 'false'],
      },
    };
    expect(extractIncludeCountFromRequest(req)).toBe(true);
  });
});
