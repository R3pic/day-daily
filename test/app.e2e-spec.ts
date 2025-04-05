import request, { Response } from 'supertest';
import { App } from 'supertest/types';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { AppModule } from './../src/app.module';
import { routes } from '@common/constants/api-routes';
import { TodayThemeResponse } from '@theme/responses';

type SuperTestResponse<T> = Omit<Response, 'body'> & { body: T };

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe(`/${routes.theme.root}`, () => {
    it(`/${routes.theme.today} (GET)`, async () => {
      const res: SuperTestResponse<TodayThemeResponse> = await request(app.getHttpServer())
        .get(`/${routes.theme.root}/${routes.theme.today}`)
        .expect(200)
        .expect('Content-Type', /json/);
      expect(typeof res.body.theme).toBe('string');
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
