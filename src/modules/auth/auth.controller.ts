import { Body, Controller, HttpCode, HttpStatus, Logger, Post, UseGuards } from '@nestjs/common';

import { ReqUser } from '@common/decorator';
import { RequestUser } from '@common/dto';
import { AuthService } from './auth.service';
import { LocalGuard, RefreshJwtGuard } from '@auth/guards';
import { RegisterDto } from '@auth/dto';
import { ApiLoginResponses } from '@auth/decorator';
import { GuestJwtGuard } from '@auth/guards/guest-jwt.guard';

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
  ) {
    this.logger.debug(`login ${reqUser.id}`);
    const accessToken = await this.authService.generateAccessToken(reqUser);
    const refreshToken = await this.authService.generateRefreshToken(reqUser);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshJwtGuard)
  async refresh(
    @ReqUser() reqUser: RequestUser,
  ) {
    this.logger.debug('refresh');
    const accessToken = await this.authService.generateAccessToken(reqUser);

    return {
      access_token: accessToken,
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(GuestJwtGuard)
  async logout(
    @ReqUser() reqUser?: RequestUser,
  ) {
    this.logger.debug('logout');
    await this.authService.logout(reqUser);
  }
}
