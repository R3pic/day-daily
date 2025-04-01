import { Response } from 'express';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';

import {
  ServiceException,
  ServiceExceptionResponse,
} from '@common/exception';

@Catch(ServiceException)
export class ServiceExceptionFilter implements ExceptionFilter {
  catch(exception: ServiceException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const statusCode = exception.statusCode;

    const body: ServiceExceptionResponse = {
      statusCode,
      message: exception.message,
      path: request.url,
    };

    response.status(statusCode).json(body);
  }
}