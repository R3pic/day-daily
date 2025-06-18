import { ValidationPipe } from '@nestjs/common';

import { ServiceExceptionFilter } from '@common/filter';
import cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { requestLogMiddleware } from '@common/middleware';

export function setUpGlobal(app: NestExpressApplication) {
  app.use(requestLogMiddleware);
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