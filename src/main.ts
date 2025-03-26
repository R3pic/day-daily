import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';

import { EnvironmentVariables } from '@common/env';
import { swaggerConfig } from '@common/swagger';

import { AppModule } from './app.module';
import { API_DOC_SLUG } from 'src/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger(bootstrap.name);

  const documentFactory = () => SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(API_DOC_SLUG, app, documentFactory, { useGlobalPrefix: false });

  const configService = app.get<ConfigService<EnvironmentVariables, true>>(ConfigService);

  const host = configService.get<string>('HOST');
  const port = configService.get<number>('PORT');

  app.setGlobalPrefix('api/v1');
  await app.listen(port, () => {
    logger.log(`server running on : ${host}:${port}`);
    logger.log(`api documentation : ${host}:${port}/${API_DOC_SLUG}`);
  });
}

void bootstrap();
