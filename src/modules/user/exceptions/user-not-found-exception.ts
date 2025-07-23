import { ServiceException } from '@common/exception';
import { HttpStatus } from '@nestjs/common';
import { ErrorCode } from '@common/constants/error-code';

export class UserNotFoundException extends ServiceException {
  constructor() {
    super(HttpStatus.NOT_FOUND, '존재하지 않는 유저입니다.', ErrorCode.USER_NOT_FOUND);
  }
}