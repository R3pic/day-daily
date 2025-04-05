import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';

import { DiaryService } from '@diary/diary.service';
import { GetDiaryByUserResponse } from '@diary/responses';
import { ApiGetByUserResponses } from '@diary/decorator';
import { GetUserDiariesParam } from '@user/dto';
import { routes } from '@common/constants/api-routes';

@ApiTags('User')
@ApiExtraModels(GetDiaryByUserResponse)
@Controller(routes.user.root)
export class UserController {
  constructor(
    private readonly diaryService: DiaryService,
  ) {}

  @Get(routes.user.detail.diaries)
  @HttpCode(HttpStatus.OK)
  @ApiGetByUserResponses()
  async getUserDiaries(
    @Param() getUserDiariesParam: GetUserDiariesParam,
  ): Promise<GetDiaryByUserResponse> {
    const diaries = await this.diaryService.findManyByUserId(getUserDiariesParam.id);

    return {
      diaries,
    };
  }
}
