import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginatedResponse } from '../pagination/paginated-response';

/**
 * PaginationHeadersInterceptor
 *
 * Responsável por:
 * 1. Detectar retornos encapsulados em PaginatedResponse<T>.
 * 2. Se houver metadados de contagem (total definido):
 *    - Calcula totalPages de forma segura (0 quando total for 0, fallback de limit = 100).
 *    - Injeta os cabeçalhos HTTP na resposta (X-Total-Count, X-Total-Pages, X-Current-Page, X-Per-Page).
 * 3. Desempacota o payload, entregando ao cliente final apenas o array original (body.data).
 * 4. Para qualquer outro tipo de resposta, repassa sem nenhuma alteração.
 */
@Injectable()
export class PaginationHeadersInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((body) => {
        if (body instanceof PaginatedResponse) {
          const res = context.switchToHttp().getResponse();

          if (body.total !== undefined && res && typeof res.setHeader === 'function') {
            const pageSize =
              body.pageSize && body.pageSize > 0 ? body.pageSize : 100;
            const totalPages =
              body.total === 0 ? 0 : Math.ceil(body.total / pageSize);
            const currentPage = body.page && body.page > 0 ? body.page : 1;

            res.setHeader('X-Total-Count', String(body.total));
            res.setHeader('X-Total-Pages', String(totalPages));
            res.setHeader('X-Current-Page', String(currentPage));
            res.setHeader('X-Per-Page', String(pageSize));
          }

          return body.data;
        }

        return body;
      }),
    );
  }
}
