import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '@user/user.module';
import { HashService } from '@auth/hash.service';
import { LocalStrategy } from '@auth/strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtOptionFactory } from '@auth/factory';
import { RefreshJwtStrategy } from '@auth/strategies/refresh-jwt.strategy';
import { TokenService } from '@auth/token.service';
import { AccessJwtStrategy } from '@auth/strategies/access-jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useClass: JwtOptionFactory,
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    HashService,
    TokenService,
    LocalStrategy,
    AccessJwtStrategy,
    RefreshJwtStrategy,
  ],
})
export class AuthModule {}
