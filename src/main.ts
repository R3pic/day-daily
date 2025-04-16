import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { EnvironmentVariables } from '@common/env';

import { AppModule } from './app.module';
import {
  setUpCors,
  setUpGlobal,
  setUpSwagger,
} from './bootstrap';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService<EnvironmentVariables, true>>(ConfigService);

  const port = configService.get<number>('PORT');

  setUpGlobal(app, configService);
  setUpCors(app);
  setUpSwagger(app);

  await app.listen(port);
}

void bootstrap();
