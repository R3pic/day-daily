import {
  Controller, Get,
  HttpCode, HttpStatus, Query,
} from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';

import { routes } from '@common/constants/api-routes';
import { PaginationQuery, RequestUser } from '@common/dto';
import { DiaryService } from '@diary/diary.service';
import { GetRecentDiaryResponse } from '@diary/responses';
import { ApiGetRecentDiaryResponses } from '@diary/decorator';
import { ReqUser } from '@common/decorator';

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
    @ReqUser() requestUser: RequestUser | null,
    @Query() query: PaginationQuery,
  ): Promise<GetRecentDiaryResponse> {
    query.offset = query.offset ? query.offset : 0;
    query.limit = query.limit ? query.limit : 4;

    const diaries = await this.diaryService.findByRecent(requestUser, query);

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
