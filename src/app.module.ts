import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { ProductModule } from './modules/product/product.module';
import { OrderModule } from './modules/order/order.module';
import { PaymentMethodModule } from './modules/payment-method/payment-method.module';
import { ReceiptModule } from './modules/receipt/receipt.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    ProductModule,
    OrderModule,
    PaymentMethodModule,
    ReceiptModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
