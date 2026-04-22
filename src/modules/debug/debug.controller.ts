import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import * as Sentry from "@sentry/nestjs";


@ApiTags('Debug')
@Controller('debug-sentry')
export class DebugController {
  @Get()
  @ApiOperation({ summary: 'Gera um erro proposital para testar a integração com o Sentry' })
  getError() {
    Sentry.logger.info('User triggered test log', { action: 'test_log' })

    throw new Error('My first Sentry error!');
  }
}
