import {
  Controller, Get,
  HttpCode, HttpStatus, Logger, Query, UseGuards,
} from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';

import { routes } from '@common/constants/api-routes';
import { PaginationQuery, RequestUser } from '@common/dto';
import { DiaryService } from '@diary/diary.service';
import { GetRecentDiaryResponse } from '@diary/responses';
import { ApiGetRecentDiaryResponses } from '@diary/decorator';
import { ReqUser } from '@common/decorator';
import { GuestJwtGuard } from '@auth/guards/guest-jwt.guard';

@ApiTags('Diary')
@ApiExtraModels(GetRecentDiaryResponse)
@Controller(routes.diary.root)
export class DiaryController {
  private readonly logger = new Logger(DiaryController.name);

  constructor(
    private readonly diaryService: DiaryService,
  ) {}

  @Get(routes.diary.recent)
  @HttpCode(HttpStatus.OK)
  @UseGuards(GuestJwtGuard)
  @ApiGetRecentDiaryResponses()
  async recent(
    @ReqUser() requestUser: RequestUser | null,
    @Query() query: PaginationQuery,
  ): Promise<GetRecentDiaryResponse> {
    this.logger.debug(`requestUser: ${requestUser?.id}`);

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
