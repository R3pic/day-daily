import { INestApplication } from '@nestjs/common';

export function setUpCors(app: INestApplication) {
  app.enableCors({
    origin: ['https://daisy.wisoft.io/yehwan/app1'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
}