import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';
import { EnvironmentVariables } from '@common/env';
import { ConfigService } from '@nestjs/config';
import { Inject } from '@nestjs/common';

export class JwtOptionFactory implements JwtOptionsFactory {
  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService<EnvironmentVariables, true>,
  ) {}

  createJwtOptions(): JwtModuleOptions {
    return {
      global: true,
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      signOptions: {
        expiresIn: '1h',
      },
    };
  }
}