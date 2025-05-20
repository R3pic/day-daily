import { RequestUser } from '@common/dto';

export class ReadDiaryDto {
  constructor(
    public requestUser: RequestUser,
    public targetUserId: string,
  ) {}
}