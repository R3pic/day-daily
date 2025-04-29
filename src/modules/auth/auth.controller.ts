import { Body, Controller, Logger, Post } from '@nestjs/common';

import { RegisterDto } from '@auth/dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<void> {
    this.logger.debug('register');
    await this.authService.register(registerDto);
  }

  @Post('login')
  login() {
    this.logger.debug('login');
  }
}
