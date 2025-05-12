import { ServiceException } from '@common/exception';
import { HttpStatus } from '@nestjs/common';

export class DuplicatedEmailException extends ServiceException {
  constructor() {
    super(HttpStatus.CONFLICT, '동일한 이메일이 존재합니다.');
  }
}