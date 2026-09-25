export class PaginatedResponse<T> {
  constructor(
    public readonly data: T[],
    public readonly total?: number,
    public readonly page?: number,
    public readonly pageSize?: number,
  ) {}

  /**
   * Helper factory para criar instâncias de PaginatedResponse de forma legível.
   */
  static create<T>(params: {
    data: T[];
    total?: number;
    page?: number;
    pageSize?: number;
  }): PaginatedResponse<T> {
    return new PaginatedResponse(
      params.data,
      params.total,
      params.page,
      params.pageSize,
    );
  }
}
