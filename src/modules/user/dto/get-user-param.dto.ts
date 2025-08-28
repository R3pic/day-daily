import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetUserParam {
  @IsUUID()
  @ApiProperty({ description: '사용자 고유 아이디' })
  id: string;
}