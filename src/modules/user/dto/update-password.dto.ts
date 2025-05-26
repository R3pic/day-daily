import { RequestUser } from '@common/dto';
import { UpdatePasswordBody } from '@user/dto/update-password.body';

export class UpdatePasswordDto {
  requestUser: RequestUser;
  beforePassword: string;
  newPassword: string;

  constructor(requestUser: RequestUser, updatePasswordBody: UpdatePasswordBody) {
    this.requestUser = requestUser;
    this.beforePassword = updatePasswordBody.before_password;
    this.newPassword = updatePasswordBody.new_password;
  }
}