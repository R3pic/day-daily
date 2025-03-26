import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

import { EnvironmentVariables } from '@common/env';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger(bootstrap.name);
  const configService = app.get<ConfigService<EnvironmentVariables, true>>(ConfigService);

  const host = configService.get<string>('HOST');
  const port = configService.get<number>('PORT');

  await app.listen(port, () => {
    logger.log(`server running on : ${host}:${port}`);
  });
}

void bootstrap();
