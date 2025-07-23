import { ServiceException } from '@common/exception';
import { HttpStatus } from '@nestjs/common';
import { ErrorCode } from '@common/constants/error-code';

export class InvalidTokenException extends ServiceException {
  constructor() {
    super(HttpStatus.UNAUTHORIZED, '토큰이 올바르지 않습니다.', ErrorCode.TOKEN_EXPIRED);
  }
}