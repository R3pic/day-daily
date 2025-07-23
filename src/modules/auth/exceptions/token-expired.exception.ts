import { ServiceException } from '@common/exception';
import { HttpStatus } from '@nestjs/common';
import { ErrorCode } from '@common/constants/error-code';

export class TokenExpiredException extends ServiceException {
  constructor() {
    super(HttpStatus.UNAUTHORIZED, '토큰이 만료되었습니다.', ErrorCode.TOKEN_EXPIRED);
  }
}