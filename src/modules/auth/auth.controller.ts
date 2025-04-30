import { Response } from 'express';
import { Body, Controller, HttpCode, HttpStatus, Logger, Post, Res, UseGuards } from '@nestjs/common';

import { ReqUser } from '@common/decorator';
import { RequestUser } from '@common/dto';
import { AuthService } from './auth.service';
import { LocalGuard } from '@auth/guards';
import { RegisterDto } from '@auth/dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(
    private readonly authService: AuthService
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<void> {
    this.logger.debug('register');
    await this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalGuard)
  async localLogin(
    @ReqUser() reqUser: RequestUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    this.logger.debug('login');
    const access_token = await this.authService.generateAccessToken(reqUser.id);
    res.cookie('access_token', access_token, { secure: true, httpOnly: true });
  }
}
