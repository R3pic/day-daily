import { Module } from '@nestjs/common';

import { ThemeModule } from '@theme/theme.module';
import { DiaryService } from '@diary/diary.service';
import { DiaryRepository } from '@diary/diary.repository';
import { DiaryController } from './diary.controller';

@Module({
  imports: [ThemeModule],
  providers: [
    DiaryService,
    DiaryRepository,
  ],
  exports: [DiaryService],
  controllers: [DiaryController],
})
export class DiaryModule {}
