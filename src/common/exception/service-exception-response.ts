import { HttpStatus } from '@nestjs/common';

export class ServiceExceptionResponse {
  constructor(
    readonly statusCode: HttpStatus,
    readonly message: string,
    readonly path: string,
  ) {}
}