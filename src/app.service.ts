import { Injectable } from '@nestjs/common';
import type { IAppService } from './interfaces/app.service.interface';

@Injectable()
export class AppService implements IAppService {
  getHello(): string {
    return 'Hello World!';
  }
}
