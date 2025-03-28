import { Module } from '@nestjs/common';

import { ThemeModule } from '@theme/theme.module';
import { DiaryService } from '@diary/diary.service';
import { DiaryRepository } from '@diary/diary.repository';

@Module({
  imports: [ThemeModule],
  providers: [
    DiaryService,
    DiaryRepository,
  ],
  exports: [DiaryService],
})
export class DiaryModule {}
