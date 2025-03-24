import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [],
    }).compile();
  });

  describe('getHealth', () => {
    it('should return "Tours Booking Server is up and running"', () => {
      const appController = app.get<AppController>(AppController);
      expect(appController.getHealth()).toEqual({
        message: 'Tours Booking Server is up and running',
      });
    });
  });
});
