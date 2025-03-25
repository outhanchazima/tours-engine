import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { Booking } from './entities/booking.entity';
import { PaymentBooking } from './entities/payment-booking.entity';
import { Payment } from './entities/payment.entity';
import { Tour } from './entities/tour.entity';
import { User } from './entities/user.entity';

@Module({})
export class DatabaseModule {
  static forRoot(): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: (configService: ConfigService) => ({
            type: 'postgres',
            url: configService.get('DATABASE_URL'),
            entities: join(__dirname, 'entities', '**', '*.entity.{ts,js}'),
            autoLoadEntities: true,
            synchronize: configService.get<boolean>('DATABASE_SYNC', false),
            logging: configService.get<boolean>('DATABASE_LOGGING', false),
          }),
          inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([
          User,
          Tour,
          Booking,
          Payment,
          PaymentBooking,
        ]),
      ],
      providers: [],
      exports: [TypeOrmModule],
      global: true,
    };
  }
}
