import { HttpStatus } from '@nestjs/common';
import { ErrorCode } from '@common/constants/error-code';

export class ServiceExceptionResponse {
  constructor(
    readonly errorCode: ErrorCode,
    readonly statusCode: HttpStatus,
    readonly message: string,
    readonly path: string,
  ) {}
}