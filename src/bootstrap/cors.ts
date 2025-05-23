import { INestApplication } from '@nestjs/common';

export function setUpCors(app: INestApplication) {
  app.enableCors({
    origin: ['http://localhost:5174','https://daisy.wisoft.io'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
}