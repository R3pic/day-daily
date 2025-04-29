import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '@user/user.module';
import { HashService } from '@auth/hash.service';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    HashService,
  ],
})
export class AuthModule {}
