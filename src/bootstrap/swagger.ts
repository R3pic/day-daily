import { INestApplication } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';

import { swaggerConfig } from '@common/swagger';
import { API_DOC_SLUG } from './constants';

export function setUpSwagger(app: INestApplication) {
  const documentFactory = () => SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(API_DOC_SLUG, app, documentFactory, { useGlobalPrefix: true });
}