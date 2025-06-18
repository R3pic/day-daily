import { INestApplication } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';

import { API_DOC_SLUG } from './constants';
import { Environment } from '@common/env';
import { createSwaggerConfig } from '@common/swagger';

export function setUpSwagger(app: INestApplication, NODE_ENV: Environment) {
  const documentFactory = () => SwaggerModule.createDocument(app, createSwaggerConfig(NODE_ENV));
  SwaggerModule.setup(API_DOC_SLUG, app, documentFactory, { useGlobalPrefix: true });
}