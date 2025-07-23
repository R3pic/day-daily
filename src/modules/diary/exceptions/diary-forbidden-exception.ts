import { ServiceException } from '@common/exception';
import { HttpStatus } from '@nestjs/common';
import { ErrorCode } from '@common/constants/error-code';

export class DiaryForbiddenException extends ServiceException {
  constructor() {
    super(HttpStatus.FORBIDDEN, '일기에 대한 접근 권한이 존재하지 않습니다.', ErrorCode.DIARY_FORBIDDEN);
  }
}