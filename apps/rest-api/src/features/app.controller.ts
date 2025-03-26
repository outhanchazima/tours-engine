import { Controller, Get } from '@nestjs/common';
import { Public } from '../shared/decorators/public.decorator';

@Controller()
@Public()
export class AppController {
  @Public()
  @Get('health')
  getHealth() {
    return { message: 'Tours Booking Server is up and running' };
  }

  @Public()
  @Get('debug-sentry')
  getError() {
    throw new Error('My first Sentry error!');
  }
}
