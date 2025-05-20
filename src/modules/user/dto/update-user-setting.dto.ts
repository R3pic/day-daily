import { RequestUser } from '@common/dto';
import { UpdateUserSettingBody } from '@user/dto/update-user-setting-body.dto';

export class UpdateUserSettingDto {
  user: RequestUser;
  hideDiaries?: boolean;
  hideProfile?: boolean;

  constructor(
    requestUser: RequestUser,
    body: UpdateUserSettingBody,
  ) {
    this.user = requestUser;
    this.hideDiaries = body.hide_diary;
    this.hideProfile = body.hide_profile;
  }
}