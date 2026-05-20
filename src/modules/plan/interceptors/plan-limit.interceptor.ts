import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { PlanService } from '../plan.service';
import { differenceInDays, parseISO } from 'date-fns';
import type { JwtPayload } from '../../auth/types/jwt-payload';

@Injectable()
export class PlanLimitInterceptor implements NestInterceptor {
  constructor(private readonly planService: PlanService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;

    // Se não houver usuário logado (ex: rotas públicas), apenas segue
    if (!user) {
      return next.handle();
    }

    const userId = user.sub;
    const path = request.url;

    // Isentar rotas de gestão operacional e autenticação
    const isExcluded = [
      '/api/v1/auth',
      '/api/v1/plans',
      '/api/v1/users',
      '/api/v1/roles',
      '/api/v1/permissions',
      '/api/v1/db-credentials',
      '/api/v1/announcements',
      '/integration',
      '/status',
    ].some((excluded) => path.startsWith(excluded));

    if (isExcluded) {
      return next.handle();
    }

    const limits = await this.planService.getUserLimits(userId);

    // 1. Verificar limites de frequência (Minuto e Mês)
    const reqsMinute = await this.planService.getRequestCount(userId, 'minute');
    if (reqsMinute >= limits.reqMin) {
      throw new HttpException(
        `Limite de requisições por minuto atingido (${limits.reqMin}).`,
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const reqsMonth = await this.planService.getRequestCount(userId, 'month');
    if (reqsMonth >= limits.reqMonth) {
      throw new HttpException(
        `Limite de requisições mensal atingido (${limits.reqMonth}).`,
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // 2. Limitar PageSize (limit ou pageSize na query)
    const query = request.query;
    const pageSizeParam = query.limit || query.pageSize || query.take;

    if (pageSizeParam) {
      const requestedSize = Number(pageSizeParam);
      if (!isNaN(requestedSize) && requestedSize > limits.maxPageSize) {
        throw new HttpException(
          `Seu plano permite um pageSize máximo de ${limits.maxPageSize}. Valor solicitado: ${requestedSize}.`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    // 3. Limitar Date Range (startDate e endDate)
    if (query.startDate && query.endDate) {
      try {
        const start = parseISO(query.startDate);
        const end = parseISO(query.endDate);
        const diff = Math.abs(differenceInDays(end, start));

        if (diff > limits.maxDateRangeDays) {
          throw new HttpException(
            `Seu plano permite consultas de no máximo ${limits.maxDateRangeDays} dias. Intervalo solicitado: ${diff} dias.`,
            HttpStatus.FORBIDDEN,
          );
        }
      } catch (e) {
        if (e instanceof HttpException) throw e;
      }
    }

    // 4. Prosseguir e Logar ao concluir
    return next.handle().pipe(
      tap({
        next: () => {
          this.planService
            .logRequest(
              userId,
              request.method,
              request.url,
              context.switchToHttp().getResponse().statusCode,
              request.ip,
            )
            .catch(() => {});
        },
        error: (err) => {
          if (
            !(
              err instanceof HttpException &&
              err.getStatus() === HttpStatus.TOO_MANY_REQUESTS
            )
          ) {
            this.planService
              .logRequest(
                userId,
                request.method,
                request.url,
                err.status || 500,
                request.ip,
              )
              .catch(() => {});
          }
        },
      }),
    );
  }
}
