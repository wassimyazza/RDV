import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { EventsService } from '../events/events.service';
import { PdfService } from '../pdf/pdf.service';
import { ReservationStatus } from '../enums/reservation-status.enum';
import { EventStatus } from '../enums/event-status.enum';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private reservationsRepository: Repository<Reservation>,
    private eventsService: EventsService,
    private pdfService: PdfService,
  ) {}

  async create(
    userId: string,
    createReservationDto: CreateReservationDto,
  ): Promise<Reservation> {
    const event = await this.eventsService.findOne(
      createReservationDto.eventId,
    );

    if (event.status === EventStatus.CANCELED) {
      throw new BadRequestException('Cannot reserve a canceled event');
    }

    if (event.status !== EventStatus.PUBLISHED) {
      throw new BadRequestException('Event is not published');
    }

    if (event.reservedSeats >= event.capacity) {
      throw new BadRequestException('Event is full');
    }

    const existingReservation = await this.reservationsRepository.findOne({
      where: {
        userId: userId,
        eventId: createReservationDto.eventId,
        status: ReservationStatus.PENDING || ReservationStatus.CONFIRMED,
      },
    });

    if (existingReservation) {
      throw new BadRequestException(
        'You already have a reservation for this event',
      );
    }

    event.reservedSeats += 1;
    await this.eventsService.update(event.id, {
      reservedSeats: event.reservedSeats,
    } as any);

    const reservation = this.reservationsRepository.create({
      userId: userId,
      eventId: createReservationDto.eventId,
    });

    return this.reservationsRepository.save(reservation);
  }

  async findAll(): Promise<Reservation[]> {
    return this.reservationsRepository.find({
      relations: ['user', 'event'],
    });
  }

  async findByEvent(eventId: string): Promise<Reservation[]> {
    return this.reservationsRepository.find({
      where: { eventId },
      relations: ['user'],
    });
  }

  async findByUser(userId: string): Promise<Reservation[]> {
    return this.reservationsRepository.find({
      where: { userId },
      relations: ['event'],
    });
  }

  async findOne(id: string): Promise<Reservation> {
    const reservation = await this.reservationsRepository.findOne({
      where: { id },
      relations: ['user', 'event'],
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    return reservation;
  }

  async confirm(id: string): Promise<Reservation> {
    const reservation = await this.findOne(id);

    if (reservation.status !== ReservationStatus.PENDING) {
      throw new BadRequestException(
        'Only pending reservations can be confirmed',
      );
    }

    reservation.status = ReservationStatus.CONFIRMED;
    return this.reservationsRepository.save(reservation);
  }

  async refuse(id: string): Promise<Reservation> {
    const reservation = await this.findOne(id);

    if (reservation.status !== ReservationStatus.PENDING) {
      throw new BadRequestException('Only pending reservations can be refused');
    }

    reservation.status = ReservationStatus.REFUSED;

    const event = await this.eventsService.findOne(reservation.eventId);
    event.reservedSeats -= 1;
    await this.eventsService.update(event.id, {
      reservedSeats: event.reservedSeats,
    } as any);

    return this.reservationsRepository.save(reservation);
  }

  async cancel(id: string, userId: string): Promise<Reservation> {
    const reservation = await this.findOne(id);

    if (reservation.userId !== userId) {
      throw new BadRequestException(
        'You can only cancel your own reservations',
      );
    }

    if (reservation.status === ReservationStatus.CANCELED) {
      throw new BadRequestException('Reservation is already canceled');
    }

    reservation.status = ReservationStatus.CANCELED;

    const event = await this.eventsService.findOne(reservation.eventId);
    event.reservedSeats -= 1;
    await this.eventsService.update(event.id, {
      reservedSeats: event.reservedSeats,
    } as any);

    return this.reservationsRepository.save(reservation);
  }

  async cancelByAdmin(id: string): Promise<Reservation> {
    const reservation = await this.findOne(id);

    if (reservation.status === ReservationStatus.CANCELED) {
      throw new BadRequestException('Reservation is already canceled');
    }

    reservation.status = ReservationStatus.CANCELED;

    const event = await this.eventsService.findOne(reservation.eventId);
    event.reservedSeats -= 1;
    await this.eventsService.update(event.id, {
      reservedSeats: event.reservedSeats,
    } as any);

    return this.reservationsRepository.save(reservation);
  }

  async downloadTicket(id: string, userId: string): Promise<Buffer> {
    const reservation = await this.findOne(id);

    if (reservation.userId !== userId) {
      throw new BadRequestException('You can only download your own tickets');
    }

    if (reservation.status !== ReservationStatus.CONFIRMED) {
      throw new BadRequestException(
        'Ticket can only be downloaded for confirmed reservations',
      );
    }

    return this.pdfService.generateTicket(reservation);
  }
}
