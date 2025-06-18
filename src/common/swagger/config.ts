import { DocumentBuilder } from '@nestjs/swagger';
import { Environment } from '@common/env';

export function createSwaggerConfig(NODE_ENV: Environment, HOST: string) {
  const documentBuilder = new DocumentBuilder()
    .setTitle('day-daily API')
    .setDescription('day-daily를 위한 API 문서')
    .setVersion('0.0.1')
    .addTag('User')
    .addTag('Diary')
    .addTag('Theme')
    .addTag('Me');

  if (NODE_ENV === Environment.Production)
    documentBuilder.addServer(HOST);

  return documentBuilder.build();
}