import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GuestJwtGuard extends AuthGuard('access') {
  handleRequest<RequestUser>(
    err: any,
    user: RequestUser | undefined,
  ): RequestUser | null {
    return user ?? null;
  }
}