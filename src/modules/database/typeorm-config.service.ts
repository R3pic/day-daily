import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

import { EnvironmentVariables } from '@common/env';
import { TypeOrmCustomLogger } from '@database/type-orm-logger';

@Injectable()
export class TypeormConfigService implements TypeOrmOptionsFactory{
  constructor(
    private readonly configService: ConfigService<EnvironmentVariables, true>,
  ) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      database: this.configService.get('DATABASE_NAME'),
      host: this.configService.get('DATABASE_HOST'),
      port: this.configService.get('DATABASE_PORT'),
      username: this.configService.get('DATABASE_USER'),
      password: this.configService.get('DATABASE_PASSWORD'),
      entities: [],
      synchronize: true, // 프로덕션 환경에서는 무조건 false로 두고 사용할 것
      autoLoadEntities: true,
      logger: new TypeOrmCustomLogger(),
    };
  }
}