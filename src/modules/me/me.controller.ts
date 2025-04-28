import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';

import { routes } from '@common/constants/api-routes';
import { DiaryService } from '@diary/diary.service';
import { CreateDiaryResponse, GetDiaryByUserResponse } from '@diary/responses';
import { CreateDiaryDto, DeleteDiaryDto, UpdateDiaryDto } from '@diary/dto';
import { ApiCreateDiaryResponses, ApiDeleteDiaryResponses, ApiGetByUserResponses } from '@diary/decorator';
import { ApiUpdateDiaryResponses } from '@diary/decorator/api-update-diary.decorator';
import { UpdateDiaryBody } from '@diary/dto/update-diary-body.dto';
import { UpdateDiaryParam } from '@diary/dto/update-diary-param.dto';
import { PaginationQuery } from '@common/dto';

@ApiTags('Me')
@ApiExtraModels(CreateDiaryResponse)
@Controller(routes.me.root)
export class MeController {
  constructor(
    private readonly diaryService: DiaryService,
  ) {}

  @Get(routes.me.diary.root)
  @HttpCode(HttpStatus.OK)
  @ApiGetByUserResponses()
  async getDiaries(
    @Query() query: PaginationQuery,
  ): Promise<GetDiaryByUserResponse> {
    query.offset = query.offset ? query.offset : 0;
    query.limit = query.limit ? query.limit : 15;

    const diaries = await this.diaryService.findManyByUserId('3997d213-112a-11f0-b5c6-0242ac120002', query);

    const nextOffset = query.offset + query.limit;
    const limit = query.limit;

    return {
      diaries,

      links: {
        next: `/${routes.me.root}/${routes.me.diary.root}?offset=${nextOffset}&limit=${limit}`,
      },
    };
  }

  @Post(routes.me.diary.root)
  @HttpCode(HttpStatus.CREATED)
  @ApiCreateDiaryResponses()
  async createDiary(
    @Body() createDiaryDto: CreateDiaryDto,
  ): Promise<CreateDiaryResponse> {
    const diary = await this.diaryService.create(createDiaryDto);

    return {
      diary,
    };
  }

  @Patch(routes.me.diary.detail)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiUpdateDiaryResponses()
  async updateDiary(
    @Param() updateDiaryParam: UpdateDiaryParam,
    @Body() updateDiaryBody: UpdateDiaryBody,
  ): Promise<void> {
    const updateDiaryDto = UpdateDiaryDto.of(updateDiaryParam, updateDiaryBody);

    await this.diaryService.update(updateDiaryDto);
  }

  @Delete(routes.me.diary.detail)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiDeleteDiaryResponses()
  async deleteDiary(
    @Param() deleteDiaryDto: DeleteDiaryDto,
  ) {
    await this.diaryService.delete(deleteDiaryDto);
  }
}
