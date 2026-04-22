import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SentryModule } from '@sentry/nestjs/setup';
import { AuthModule } from './modules/auth/auth.module';
import { ProductModule } from './modules/product/product.module';
import { OrderModule } from './modules/order/order.module';
import { PaymentMethodModule } from './modules/payment-method/payment-method.module';
import { ReceiptModule } from './modules/receipt/receipt.module';
import { AccountReceivableModule } from './modules/account-receivable/account-receivable.module';

import { DebugModule } from './modules/debug/debug.module';


@Module({
  imports: [
    SentryModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    ProductModule,
    OrderModule,
    PaymentMethodModule,
    ReceiptModule,
    AccountReceivableModule,
    DebugModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
