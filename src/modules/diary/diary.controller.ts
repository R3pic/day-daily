import {
  Controller, Get,
  HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';

import { DiaryService } from '@diary/diary.service';
import { GetRecentDiaryResponse } from '@diary/responses';
import { ApiGetRecentDiaryResponses } from '@diary/swagger';

@ApiTags('Diary')
@ApiExtraModels(GetRecentDiaryResponse)
@Controller('diaries')
export class DiaryController {
  constructor(
    private readonly diaryService: DiaryService,
  ) {}

  @Get('recent')
  @HttpCode(HttpStatus.OK)
  @ApiGetRecentDiaryResponses()
  async recent(): Promise<GetRecentDiaryResponse> {
    const diaries = await this.diaryService.findByRecent();

    return {
      diaries,
    };
  }
}
