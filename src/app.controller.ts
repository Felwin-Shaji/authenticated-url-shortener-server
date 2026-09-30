import { Controller, Get, Inject } from '@nestjs/common';
import type { IAppService } from './interfaces/app.service.interface';
import { APP_SERVICE } from './interfaces/app.service.token';

@Controller()
export class AppController {
  constructor(
    @Inject(APP_SERVICE)
    private readonly appService: IAppService
  ) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
