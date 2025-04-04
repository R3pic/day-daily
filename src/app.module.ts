import { ClsModule } from 'nestjs-cls';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { getDataSourceToken, TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

import { validate } from '@common/env';
import { ThemeModule } from '@theme/theme.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MeModule } from '@me/me.module';
import { DiaryModule } from '@diary/diary.module';
import { TypeormConfigService } from '@database/typeorm-config.service';

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
    ClsModule.forRoot({
      plugins: [
        new ClsPluginTransactional({
          imports: [TypeOrmModule],
          adapter: new TransactionalAdapterTypeOrm({
            dataSourceToken: getDataSourceToken(),
          }),
        }),
      ],
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
