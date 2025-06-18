import { Logger } from '@nestjs/common';
import { NextFunction, Request } from 'express';

const requestLogger = new Logger(requestLogMiddleware.name);

export function requestLogMiddleware(
  req: Request,
  _: Response,
  next: NextFunction,
) {
  requestLogger.log(`new Request [${req.method}] ${req.originalUrl}`);
  next();
}