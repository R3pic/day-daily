import { DiaryDto } from '@diary/dto';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationLinkDto } from '@common/dto/pagination-link.dto';

export class GetRecentDiaryResponse {
  @ApiProperty({
    description: '가장 최근에 작성된 일기 목록',
    type: DiaryDto,
    isArray: true,
  })
  diaries: DiaryDto[];

  links: Pick<PaginationLinkDto, 'next'>;
}