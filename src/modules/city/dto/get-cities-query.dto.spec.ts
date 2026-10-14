import { GetCitiesQuerySchema } from './get-cities-query.dto';

describe('GetCitiesQuerySchema', () => {
  test.each([
    ['empty query', {}],
    ['with page and pageSize', { page: '2', pageSize: '50' }],
    ['with search term', { search: 'FORTALEZA' }],
    ['with stateId', { stateId: '23' }],
    [
      'with all valid query params',
      { page: '1', pageSize: '20', search: 'SOBRAL', stateId: '23' },
    ],
  ])('should accept %s', (_, input) => {
    expect(() => GetCitiesQuerySchema.parse(input)).not.toThrow();
  });

  test.each([
    ['invalid page (zero or negative)', { page: 0 }],
    ['invalid pageSize (zero or negative)', { pageSize: -5 }],
    ['non-numeric page', { page: 'abc' }],
    ['non-numeric stateId', { stateId: 'invalid' }],
  ])('should reject %s', (_, input) => {
    expect(() => GetCitiesQuerySchema.parse(input)).toThrow();
  });
});
