import { Module } from '@nestjs/common';

import { ThemeModule } from '@theme/theme.module';
import { DiaryService } from '@diary/diary.service';
import { DiaryRepository } from '@diary/diary.repository';
import { DiaryController } from './diary.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiaryEntity } from '@diary/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([DiaryEntity]),
    ThemeModule,
  ],
  providers: [
    DiaryService,
    DiaryRepository,
  ],
  exports: [DiaryService],
  controllers: [DiaryController],
})
export class DiaryModule {}
