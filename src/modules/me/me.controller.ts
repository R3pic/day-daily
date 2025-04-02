import { Body, Controller, Delete, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';

import { DiaryService } from '@diary/diary.service';
import { CreateDiaryResponse } from '@diary/responses';
import { CreateDiaryDto, DeleteDiaryDto, UpdateDiaryDto } from '@diary/dto';
import { ApiCreateDiaryResponses, ApiDeleteDiaryResponses } from '@diary/decorator';
import { ApiUpdateDiaryResponses } from '@diary/decorator/api-update-diary.decorator';
import { UpdateDiaryBody } from '@diary/dto/update-diary-body.dto';
import { UpdateDiaryParam } from '@diary/dto/update-diary-param.dto';

@ApiTags('Me')
@ApiExtraModels(CreateDiaryResponse)
@Controller('me')
export class MeController {
  constructor(
    private readonly diaryService: DiaryService,
  ) {}

  @Post('diaries')
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

  @Patch('diaries/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiUpdateDiaryResponses()
  async updateDiary(
    @Param() updateDiaryParam: UpdateDiaryParam,
    @Body() updateDiaryBody: UpdateDiaryBody,
  ): Promise<void> {
    const updateDiaryDto = UpdateDiaryDto.of(updateDiaryParam, updateDiaryBody);

    await this.diaryService.update(updateDiaryDto);
  }

  @Delete('diaries/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiDeleteDiaryResponses()
  async deleteDiary(
    @Param() deleteDiaryDto: DeleteDiaryDto,
  ) {
    await this.diaryService.delete(deleteDiaryDto);
  }
}
