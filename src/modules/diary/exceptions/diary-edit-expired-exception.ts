import { ServiceException } from '@common/exception';
import { HttpStatus } from '@nestjs/common';
import { ErrorCode } from '@common/constants/error-code';

export class DiaryEditExpiredException extends ServiceException {
  constructor() {
    super(HttpStatus.UNPROCESSABLE_ENTITY, '수정가능한 시간이 지났습니다.', ErrorCode.DIARY_EDIT_EXPIRED);
  }
}