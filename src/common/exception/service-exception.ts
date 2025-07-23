import { HttpStatus } from '@nestjs/common';
import { ErrorCode } from '@common/constants/error-code';

export class ServiceException extends Error {
  readonly statusCode: HttpStatus;
  readonly errorCode: ErrorCode;

  constructor(
    statusCode: HttpStatus,
    message: string,
    errorCode: ErrorCode,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }
}