import { HttpStatus } from '@nestjs/common';

export class ServiceException extends Error {
  readonly statusCode: HttpStatus;

  constructor(
    statusCode: HttpStatus,
    message: string,
  ) {
    super(message);
    this.statusCode = statusCode;
  }
}