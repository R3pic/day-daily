import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

import { validate } from '@common/env';
import { ThemeModule } from '@theme/theme.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MeModule } from '@me/me.module';
import { DiaryModule } from '@diary/diary.module';
import { TypeormConfigService } from '@database/typeorm-config.service';
import { DatabaseModule } from '@database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
      envFilePath: ['.env', '.env.database'],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeormConfigService,
    }),
    ScheduleModule.forRoot(),
    ThemeModule,
    MeModule,
    DiaryModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
