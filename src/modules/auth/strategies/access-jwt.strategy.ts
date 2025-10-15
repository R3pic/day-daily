import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '@common/env';
import { RequestUser } from '@common/dto';
import { Payload } from '@auth/interfaces/payload';

export class AccessJwtStrategy extends PassportStrategy(Strategy, 'access') {
  constructor(
    @Inject(ConfigService) configService: ConfigService<EnvironmentVariables, true>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_ACCESS_SECRET'),
    });
  }

  validate(payLoad: Payload): RequestUser {
    return {
      id: payLoad.id,
    };
  }
}