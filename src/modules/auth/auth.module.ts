import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { EnvModule } from 'src/config/env/env.module';
import { EnvService } from 'src/config/env/env.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AUTH_CONFIG, buildAuthConfig } from 'src/config/auth.config';
import { InfraRegistryModule } from 'src/infra/prisma/infra-registry.module';

@Module({
  imports: [
    InfraRegistryModule,
    JwtModule.registerAsync({
      inject: [EnvService],
      useFactory: (env: EnvService) => ({
        secret: env.get('JWT_SECRET'),
        signOptions: { expiresIn: env.get('JWT_EXPIRES_IN') },
      }),
    }),
    EnvModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
    {
      provide: AUTH_CONFIG,
      inject: [EnvService],
      useFactory: buildAuthConfig,
    },
  ],
  exports: [JwtModule, JwtAuthGuard, AUTH_CONFIG],
})
export class AuthModule {}
