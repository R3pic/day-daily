import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOkResponse({ description: '요청이 성공했을 경우', example: 'Hello World!' })
  getHello(): string {
    return this.appService.getHello();
  }
}
