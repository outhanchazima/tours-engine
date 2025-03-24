import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get('health')
  getHealth() {
    return { message: 'Tours Booking Server is up and running' };
  }

  @Get('debug-sentry')
  getError() {
    throw new Error('My first Sentry error!');
  }
}
