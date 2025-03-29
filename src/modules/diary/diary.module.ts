import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ThemeModule } from '@theme/theme.module';
import { DiaryController } from '@diary/diary.controller';
import { DiaryService } from '@diary/diary.service';
import { DiaryRepository } from '@diary/diary.repository';
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
