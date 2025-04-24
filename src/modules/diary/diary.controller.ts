import {
  Controller, Get,
  HttpCode, HttpStatus, Query,
} from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';

import { routes } from '@common/constants/api-routes';
import { DiaryService } from '@diary/diary.service';
import { GetRecentDiaryResponse } from '@diary/responses';
import { ApiGetRecentDiaryResponses } from '@diary/decorator';
import { PaginationQuery } from '@diary/dto/pagination-query.dto';

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
  async recent(
    @Query() query: PaginationQuery,
  ): Promise<GetRecentDiaryResponse> {
    query.offset = query.offset ? query.offset : 0;
    query.limit = query.limit ? query.limit : 4;

    const diaries = await this.diaryService.findByRecent(query);

    const nextOffset = query.offset + query.limit;
    const limit = query.limit;

    return {
      diaries,

      links: {
        next: `/${routes.diary.root}/${routes.diary.recent}?offset=${nextOffset}&limit=${limit}`,
      },
    };
  }
}
