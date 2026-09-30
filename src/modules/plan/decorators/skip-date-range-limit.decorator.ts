import { SetMetadata } from '@nestjs/common';

export const SKIP_DATE_RANGE_LIMIT_KEY = 'skipDateRangeLimit';

/**
 * Decorator para isentar rotas analíticas ou agregadas do limite de dias
 * (maxDateRangeDays) imposto pelo plano comercial do cliente no PlanLimitInterceptor.
 */
export const SkipDateRangeLimit = () =>
  SetMetadata(SKIP_DATE_RANGE_LIMIT_KEY, true);
