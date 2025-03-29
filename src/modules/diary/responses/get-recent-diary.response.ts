import { DiaryDto } from '@diary/dto';
import { ApiProperty } from '@nestjs/swagger';

export class GetRecentDiaryResponse {
  @ApiProperty({
    description: '가장 최근에 작성된 일기 목록',
    type: DiaryDto,
    isArray: true,
  })
  diaries: DiaryDto[];
}