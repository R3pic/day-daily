import { Request } from 'express';

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestUser } from '@common/dto';

export const ReqUser = createParamDecorator((data: unknown, ctx: ExecutionContext): RequestUser | null => {
  const request = ctx.switchToHttp().getRequest<Request>();
  return request.user as RequestUser || null;
});