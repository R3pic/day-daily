import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '@auth/auth.service';
import { RequestUser } from '@common/dto';
import { Injectable, Logger } from '@nestjs/common';
import { CredentialException } from '@auth/exceptions/credential.exception';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);

  constructor(
    private readonly authService: AuthService
  ) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<RequestUser> {
    this.logger.debug(`localStrategy: ${email}`);
    const user = await this.authService.validateLogin(email, password);

    if (!user) throw new CredentialException();

    return user;
  }
}