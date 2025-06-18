import { ServiceException } from '@common/exception';
import { HttpStatus } from '@nestjs/common';

export class AvatarNotFoundException extends ServiceException {
  constructor() {
    super(HttpStatus.NOT_FOUND, '아바타 이미지가 존재하지 않습니다.');
  }
}