import {
  IsBoolean,
  IsString, Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDiaryDto {
  @IsBoolean()
  @ApiProperty({ description: '오늘의 주제 사용 여부', example: true })
  use_theme: boolean;

  @IsString()
  @Length(1, 100)
  @ApiProperty({ description: '일기 제목', example: '일기 제목 샘플' })
  title: string;

  @IsString()
  @Length(10, 2000)
  @ApiProperty({ description: '일기 내용', example: '일기 내용 샘플입니다.' })
  content: string;
}