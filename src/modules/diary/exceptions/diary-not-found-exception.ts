import { ServiceException } from '@common/exception';
import { HttpStatus } from '@nestjs/common';
import { ErrorCode } from '@common/constants/error-code';

export class DiaryNotFoundException extends ServiceException {
  constructor(readonly id: string) {
    super(HttpStatus.NOT_FOUND, `${id}는 존재하지 않습니다.`, ErrorCode.DIARY_NOT_FOUND);
  }
}