import { RequestUser } from '@common/dto';

export class UpdateProfileAvatarDto {
  requestUser: RequestUser;
  avatar: Express.Multer.File;
}