import { ServiceException } from '@common/exception';
import { HttpStatus } from '@nestjs/common';
import { ErrorCode } from '@common/constants/error-code';

export class DuplicatedEmailException extends ServiceException {
  constructor() {
    super(HttpStatus.CONFLICT, '동일한 이메일이 존재합니다.', ErrorCode.DUPLICATED_EMAIL);
  }
}