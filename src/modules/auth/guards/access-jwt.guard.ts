import { AuthGuard } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { InvalidTokenException, TokenExpiredException, TokenNotProvidedException } from '@auth/exceptions';

@Injectable()
export class AccessJwtGuard extends AuthGuard('access') {
  private readonly logger = new Logger(AccessJwtGuard.name);
  handleRequest<RequestUser>(err: Error, user: RequestUser, info: { message: string, name: string }) {
    if (err) {
      this.logger.error(err);
      throw err;
    }

    if (!user) {
      this.logger.error(info.message);

      const message: string = info.message || 'Unauthorized';

      if (message === 'No auth token') throw new TokenNotProvidedException();
      if (message.includes('expire')) throw new TokenExpiredException();

      throw new InvalidTokenException();
    }

    return user;
  }
}