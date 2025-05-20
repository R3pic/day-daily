import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteDiaryParamDto {
  @IsUUID()
  @ApiProperty({ description: '일기 고유 아이디' })
  id: string;
}