import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { APP_SERVICE } from './interfaces/app.service.token';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{ provide: APP_SERVICE, useValue: { getHello: () => 'Hello World!' } }],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
