import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { Reservation } from './entities/reservation.entity';
import { EventsModule } from '../events/events.module';
import { PdfModule } from '../pdf/pdf.module';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation]), EventsModule, PdfModule],
  controllers: [ReservationsController],
  providers: [ReservationsService],
  exports: [ReservationsService],
})
export class ReservationsModule {}
