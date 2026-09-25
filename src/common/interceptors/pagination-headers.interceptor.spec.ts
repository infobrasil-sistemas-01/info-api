import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of, firstValueFrom } from 'rxjs';
import { PaginationHeadersInterceptor } from './pagination-headers.interceptor';
import { PaginatedResponse } from '../pagination/paginated-response';

describe('PaginationHeadersInterceptor', () => {
  let interceptor: PaginationHeadersInterceptor;
  let mockResponse: { setHeader: jest.Mock };
  let mockContext: ExecutionContext;

  beforeEach(() => {
    interceptor = new PaginationHeadersInterceptor();
    mockResponse = {
      setHeader: jest.fn(),
    };
    mockContext = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
        getRequest: () => ({}),
      }),
    } as unknown as ExecutionContext;
  });

  it('deve injetar headers e desempacotar PaginatedResponse quando total estiver definido', async () => {
    const items = [{ id: 1 }, { id: 2 }];
    const paginated = new PaginatedResponse(items, 145, 2, 50);

    const callHandler: CallHandler = {
      handle: () => of(paginated),
    };

    const result$ = interceptor.intercept(mockContext, callHandler);
    const result = await firstValueFrom(result$);

    expect(result).toBe(items);
    expect(mockResponse.setHeader).toHaveBeenCalledWith('X-Total-Count', '145');
    expect(mockResponse.setHeader).toHaveBeenCalledWith('X-Total-Pages', '3');
    expect(mockResponse.setHeader).toHaveBeenCalledWith('X-Current-Page', '2');
    expect(mockResponse.setHeader).toHaveBeenCalledWith('X-Per-Page', '50');
  });

  it('deve calcular totalPages como 0 quando total for 0', async () => {
    const paginated = new PaginatedResponse([], 0, 1, 50);

    const callHandler: CallHandler = {
      handle: () => of(paginated),
    };

    const result$ = interceptor.intercept(mockContext, callHandler);
    const result = await firstValueFrom(result$);

    expect(result).toEqual([]);
    expect(mockResponse.setHeader).toHaveBeenCalledWith('X-Total-Count', '0');
    expect(mockResponse.setHeader).toHaveBeenCalledWith('X-Total-Pages', '0');
    expect(mockResponse.setHeader).toHaveBeenCalledWith('X-Current-Page', '1');
    expect(mockResponse.setHeader).toHaveBeenCalledWith('X-Per-Page', '50');
  });

  it('deve usar fallback de pageSize = 100 quando pageSize for omitido ou inválido', async () => {
    const items = [{ id: 1 }];
    const paginated = new PaginatedResponse(items, 250, undefined, undefined);

    const callHandler: CallHandler = {
      handle: () => of(paginated),
    };

    const result$ = interceptor.intercept(mockContext, callHandler);
    const result = await firstValueFrom(result$);

    expect(result).toBe(items);
    expect(mockResponse.setHeader).toHaveBeenCalledWith('X-Total-Count', '250');
    expect(mockResponse.setHeader).toHaveBeenCalledWith('X-Total-Pages', '3'); // ceil(250 / 100) = 3
    expect(mockResponse.setHeader).toHaveBeenCalledWith('X-Current-Page', '1');
    expect(mockResponse.setHeader).toHaveBeenCalledWith('X-Per-Page', '100');
  });

  it('deve apenas desempacotar os dados sem injetar headers quando total não for informado', async () => {
    const items = [{ id: 10 }];
    const paginated = new PaginatedResponse(items);

    const callHandler: CallHandler = {
      handle: () => of(paginated),
    };

    const result$ = interceptor.intercept(mockContext, callHandler);
    const result = await firstValueFrom(result$);

    expect(result).toBe(items);
    expect(mockResponse.setHeader).not.toHaveBeenCalled();
  });

  it('NÃO deve desempacotar nem injetar headers para objetos arbitrários que contenham a chave "data"', async () => {
    const genericResponse = {
      data: '2026-09-25',
      message: 'Operação bem sucedida',
    };

    const callHandler: CallHandler = {
      handle: () => of(genericResponse),
    };

    const result$ = interceptor.intercept(mockContext, callHandler);
    const result = await firstValueFrom(result$);

    // O objeto deve permanecer intacto
    expect(result).toBe(genericResponse);
    expect(result).toEqual({
      data: '2026-09-25',
      message: 'Operação bem sucedida',
    });
    expect(mockResponse.setHeader).not.toHaveBeenCalled();
  });

  it('deve repassar respostas nulas ou arrays primitivos sem alteração', async () => {
    const rawArray = [1, 2, 3];
    const callHandler: CallHandler = {
      handle: () => of(rawArray),
    };

    const result$ = interceptor.intercept(mockContext, callHandler);
    const result = await firstValueFrom(result$);

    expect(result).toBe(rawArray);
    expect(mockResponse.setHeader).not.toHaveBeenCalled();
  });
});
