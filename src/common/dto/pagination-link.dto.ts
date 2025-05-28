import { ApiProperty } from '@nestjs/swagger';

export class PaginationLinkDto {
  @ApiProperty({ description: '다음 조회 링크' })
  next: string;
  @ApiProperty({ description: '이전 조회 링크' })
  prev: string;
}