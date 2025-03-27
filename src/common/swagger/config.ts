import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('day-daily API')
  .setDescription('day-daily를 위한 API 문서')
  .setVersion('0.0.1')
  .addTag('User')
  .addTag('Diary')
  .addTag('Theme')
  .addTag('Me')
  .build();