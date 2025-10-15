import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '@common/env';
import { RequestUser } from '@common/dto';
import { Payload } from '@auth/interfaces/payload';

export class RefreshJwtStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    @Inject(ConfigService) configService: ConfigService<EnvironmentVariables, true>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_REFRESH_SECRET'),
    });
  }

  validate(payLoad: Payload): RequestUser {
    return {
      id: payLoad.id,
    };
  }
}