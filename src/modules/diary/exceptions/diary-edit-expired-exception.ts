import { ServiceException } from '@common/exception';
import { HttpStatus } from '@nestjs/common';

export class DiaryEditExpiredException extends ServiceException {
  constructor() {
    super(HttpStatus.UNPROCESSABLE_ENTITY, '수정가능한 시간이 지났습니다.');
  }
}