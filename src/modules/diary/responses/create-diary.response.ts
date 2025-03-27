import { ApiProperty } from '@nestjs/swagger';
import { DiaryDto } from '@diary/dto/diary.dto';

export class CreateDiaryResponse {
  @ApiProperty({ description: '일기' })
  diary: DiaryDto;
}