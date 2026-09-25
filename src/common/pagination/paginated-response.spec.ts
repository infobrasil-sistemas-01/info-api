import { PaginatedResponse } from './paginated-response';

describe('PaginatedResponse', () => {
  it('deve instanciar corretamente com dados e metadados completos', () => {
    const items = [{ id: 1 }, { id: 2 }];
    const response = new PaginatedResponse(items, 100, 1, 10);

    expect(response.data).toBe(items);
    expect(response.total).toBe(100);
    expect(response.page).toBe(1);
    expect(response.pageSize).toBe(10);
    expect(response instanceof PaginatedResponse).toBe(true);
  });

  it('deve instanciar apenas com data sem metadados', () => {
    const items = ['a', 'b'];
    const response = new PaginatedResponse(items);

    expect(response.data).toBe(items);
    expect(response.total).toBeUndefined();
    expect(response.page).toBeUndefined();
    expect(response.pageSize).toBeUndefined();
    expect(response instanceof PaginatedResponse).toBe(true);
  });

  it('deve instanciar usando o método factory PaginatedResponse.create', () => {
    const items = [1, 2, 3];
    const response = PaginatedResponse.create({
      data: items,
      total: 50,
      page: 2,
      pageSize: 25,
    });

    expect(response).toBeInstanceOf(PaginatedResponse);
    expect(response.data).toEqual(items);
    expect(response.total).toBe(50);
    expect(response.page).toBe(2);
    expect(response.pageSize).toBe(25);
  });
});
