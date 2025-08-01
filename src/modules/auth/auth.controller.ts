import { Response } from 'express';
import { Body, Controller, HttpCode, HttpStatus, Logger, Post, Res, UseGuards } from '@nestjs/common';

import { ReqUser } from '@common/decorator';
import { RequestUser } from '@common/dto';
import { AuthService } from './auth.service';
import { LocalGuard, RefreshJwtGuard } from '@auth/guards';
import { RegisterDto } from '@auth/dto';
import { cookieOptions } from '@auth/constants';
import { ApiLoginResponses } from '@auth/decorator';

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
  @ApiLoginResponses()
  async localLogin(
    @ReqUser() reqUser: RequestUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    this.logger.debug(`login ${reqUser.id}`);
    const accessToken = await this.authService.generateAccessToken(reqUser);
    const refreshToken = await this.authService.generateRefreshToken(reqUser);

    res.cookie('access_token', accessToken, cookieOptions);
    res.cookie('refresh_token', refreshToken, cookieOptions);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshJwtGuard)
  async refresh(
    @ReqUser() reqUser: RequestUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    this.logger.debug('refresh');
    const accessToken = await this.authService.generateAccessToken(reqUser);

    res.cookie('access_token', accessToken, cookieOptions);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(
    @Res({ passthrough: true }) res: Response,
  ) {
    this.logger.debug('logout');
    res.clearCookie('access_token', cookieOptions);
    res.clearCookie('refresh_token', cookieOptions);
  }
}
