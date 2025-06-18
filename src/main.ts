import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';

import { Environment, EnvironmentVariables } from '@common/env';

import { AppModule } from './app.module';
import {
  setUpCors,
  setUpGlobal,
  setUpSwagger,
} from './bootstrap';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get<ConfigService<EnvironmentVariables, true>>(ConfigService);

  const port = configService.get<number>('PORT');

  setUpGlobal(app);
  setUpCors(app);
  setUpSwagger(app, configService.get<Environment>('NODE_ENV'));

  await app.listen(port);
}

void bootstrap();
