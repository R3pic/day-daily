import { ServiceException } from '@common/exception';
import { HttpStatus } from '@nestjs/common';
import { ErrorCode } from '@common/constants/error-code';

export class CredentialException extends ServiceException {
  constructor() {
    super(HttpStatus.UNAUTHORIZED, '이메일 또는 비밀번호가 잘못되었습니다.', ErrorCode.INVALID_CREDENTIAL);
  }
}