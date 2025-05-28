import { UserDto } from '@user/dto';
import { ApiProperty } from '@nestjs/swagger';

export class GetMeResponse {
  @ApiProperty({
    type: UserDto,
  })
  user: UserDto;
}