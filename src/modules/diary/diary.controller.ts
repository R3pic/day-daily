import {
  Controller, Get,
  HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';

import { routes } from '@common/constants/api-routes';
import { DiaryService } from '@diary/diary.service';
import { GetRecentDiaryResponse } from '@diary/responses';
import { ApiGetRecentDiaryResponses } from '@diary/decorator';

@ApiTags('Diary')
@ApiExtraModels(GetRecentDiaryResponse)
@Controller(routes.diary.root)
export class DiaryController {
  constructor(
    private readonly diaryService: DiaryService,
  ) {}

  @Get(routes.diary.recent)
  @HttpCode(HttpStatus.OK)
  @ApiGetRecentDiaryResponses()
  async recent(): Promise<GetRecentDiaryResponse> {
    const diaries = await this.diaryService.findByRecent();

    return {
      diaries,
    };
  }
}
