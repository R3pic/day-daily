import { RequestUser } from '@common/dto';
import { DeleteDiaryParamDto } from '@diary/dto/delete-diary-param.dto';

export class DeleteDiaryDto {
  requestUser: RequestUser;
  diaryId: string;

  constructor(
    requestUser: RequestUser,
    deleteDiaryParamDto: DeleteDiaryParamDto,
  ) {
    this.requestUser = requestUser;
    this.diaryId = deleteDiaryParamDto.id;
  }
}