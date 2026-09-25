import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Função utilitária pura para extrair o valor booleano do header `X-Request-Count`.
 */
export function extractIncludeCountFromRequest(req: any): boolean {
  const rawHeader = req?.headers?.['x-request-count'];

  if (!rawHeader) {
    return false;
  }

  const value = Array.isArray(rawHeader) ? rawHeader[0] : rawHeader;
  const normalized = String(value).trim().toLowerCase();

  return normalized === 'true' || normalized === '1' || normalized === 'yes';
}

/**
 * Custom Param Decorator para extrair a intenção de contagem total da requisição.
 *
 * Inspeciona o header `X-Request-Count`.
 * Retorna `true` se o valor for 'true', '1' ou 'yes' (case-insensitive).
 * Retorna `false` caso contrário ou se o header for omitido.
 */
export const IncludeCount = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): boolean => {
    const req = ctx.switchToHttp().getRequest();
    return extractIncludeCountFromRequest(req);
  },
);
