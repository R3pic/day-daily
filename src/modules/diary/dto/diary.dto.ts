import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class DiaryDto {
  @ApiProperty({ description: '일기 고유 아이디' })
  @Expose()
  readonly id: string;

  @ApiProperty({ description: '일기 제목' })
  @Expose()
  readonly title: string;

  @ApiProperty({ description: '일기 내용' })
  @Expose()
  readonly content: string;

  @ApiProperty({ description: '일기 작성 일자' })
  @Expose({ name: 'createdAt' })
  readonly created_at: Date;
}