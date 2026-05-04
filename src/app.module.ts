import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { ProductModule } from './modules/product/product.module';
import { OrderModule } from './modules/order/order.module';
import { PaymentMethodModule } from './modules/payment-method/payment-method.module';
import { ReceiptModule } from './modules/receipt/receipt.module';
import { AccountReceivableModule } from './modules/account-receivable/account-receivable.module';
import { HealthModule } from './modules/health/health.module';
import { IntegrationRequestModule } from './modules/integration-request/integration-request.module';
import { GlobalLoggerService } from './common/logger/logger.service';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { IpBlocklistService } from './common/throttle/ip-blocklist.service';
import { IpBlocklistMiddleware } from './common/middleware/ip-blocklist.middleware';
import { EnvModule } from './config/env/env.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EnvModule,
    AuthModule,
    ProductModule,
    OrderModule,
    PaymentMethodModule,
    ReceiptModule,
    AccountReceivableModule,
    HealthModule,
    IntegrationRequestModule,
  ],
  controllers: [],
  providers: [
    GlobalLoggerService,
    IpBlocklistService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(IpBlocklistMiddleware).forRoutes('*');
  }
}

