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
import { EmailModule } from './infra/email/email.module';
import { UserModule } from './modules/user/user.module';
import { RoleModule } from './modules/role/role.module';
import { PermissionModule } from './modules/permission/permission.module';
import { DbCredentialsModule } from './modules/db-credentials/db-credentials.module';
import { PlanModule } from './modules/plan/plan.module';
import { PlanLimitInterceptor } from './modules/plan/interceptors/plan-limit.interceptor';
import { AnnouncementModule } from './modules/announcement/announcement.module';
import { UptimeModule } from './modules/uptime/uptime.module';
import { ClientModule } from './modules/client/client.module';
import { ScheduleModule } from '@nestjs/schedule';
import { StatusModule } from './modules/status/status.module';

import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EnvModule,
    EmailModule,
    AuthModule,
    ProductModule,
    OrderModule,
    PaymentMethodModule,
    ReceiptModule,
    AccountReceivableModule,
    HealthModule,
    IntegrationRequestModule,
    UserModule,
    RoleModule,
    PermissionModule,
    DbCredentialsModule,
    PlanModule,
    AnnouncementModule,
    UptimeModule,
    ClientModule,
    ScheduleModule.forRoot(),
    StatusModule,
  ],
  controllers: [AppController],
  providers: [
    GlobalLoggerService,
    IpBlocklistService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: PlanLimitInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    // consumer.apply(IpBlocklistMiddleware).forRoutes('*path');
  }
}

