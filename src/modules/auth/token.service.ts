import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '@common/env';

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<EnvironmentVariables, true>,
  ) {}

  async generateAccessToken(id: string): Promise<string> {
    this.logger.debug('generateAccessToken');
    const accessToken = await this.jwtService.signAsync({ id }, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
    });
    return accessToken;
  }

  async generateRefreshToken(id: string): Promise<string> {
    this.logger.debug('generateAccessToken');
    const refreshToken = await this.jwtService.signAsync({ id }, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
    });
    return refreshToken;
  }
}