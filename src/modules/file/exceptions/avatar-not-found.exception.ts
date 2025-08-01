import { ServiceException } from '@common/exception';
import { HttpStatus } from '@nestjs/common';
import { ErrorCode } from '@common/constants/error-code';

export class AvatarNotFoundException extends ServiceException {
  constructor() {
    super(HttpStatus.NOT_FOUND, '아바타 이미지가 존재하지 않습니다.', ErrorCode.AVATAR_NOT_FOUND);
  }
}