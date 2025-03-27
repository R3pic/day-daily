import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { validate } from '@common/env';
import { ThemeModule } from '@theme/theme.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MeModule } from './modules/me/me.module';
import { DiaryModule } from './modules/diary/diary.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    ScheduleModule.forRoot(),
    ThemeModule,
    MeModule,
    DiaryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
