import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ServiceExceptionFilter } from '@common/filter';
import { Environment, EnvironmentVariables } from '@common/env';
import cookieParser from 'cookie-parser';

export function setUpGlobal(app: INestApplication, configService: ConfigService<EnvironmentVariables, true>) {
  const env = configService.get<Environment>('NODE_ENV');

  if (env === Environment.Production) app.setGlobalPrefix('yehwan/app1');
  app.use(cookieParser());
  app.useGlobalFilters(new ServiceExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );
}