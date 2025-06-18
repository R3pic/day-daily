import { CanActivate, ExecutionContext, Injectable, Logger, UnsupportedMediaTypeException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class FormDataOnlyGuard implements CanActivate {
  private readonly logger = new Logger(FormDataOnlyGuard.name);

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const contentType = request.headers['content-type'];

    this.logger.debug(contentType);

    if (!contentType || !contentType.includes('multipart/form-data')) {
      throw new UnsupportedMediaTypeException(
        'Content-Type must be \'multipart/form-data\'',
      );
    }

    return true;
  }
}