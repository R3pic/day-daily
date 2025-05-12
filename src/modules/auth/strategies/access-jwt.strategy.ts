import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '@common/env';
import { Request } from 'express';
import { RequestUser } from '@common/dto';
import { Payload } from '@auth/interfaces/payload';

export class AccessJwtStrategy extends PassportStrategy(Strategy, 'access') {
  constructor(
    @Inject(ConfigService) configService: ConfigService<EnvironmentVariables, true>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request): string => req.cookies['access_token'] as string,
      ]),
      secretOrKey: configService.get('JWT_ACCESS_SECRET'),
    });
  }

  validate(payLoad: Payload): RequestUser {
    return {
      id: payLoad.id,
    };
  }
}