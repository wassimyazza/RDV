import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Event } from '../events/entities/event.entity';
import { Reservation } from '../reservations/entities/reservation.entity';
import { EventStatus } from '../enums/event-status.enum';
import { ReservationStatus } from '../enums/reservation-status.enum';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
    @InjectRepository(Reservation)
    private reservationsRepository: Repository<Reservation>,
  ) {}

  async getUpcomingEvents() {
    const now = new Date();
    const upcomingEvents = await this.eventsRepository.find({
      where: {
        date: MoreThan(now),
        status: EventStatus.PUBLISHED,
      },
      order: {
        date: 'ASC',
      },
    });

    return {
      total: upcomingEvents.length,
      events: upcomingEvents,
    };
  }

  async getFillRate() {
    const events = await this.eventsRepository.find({
      where: { status: EventStatus.PUBLISHED },
    });

    const totalCapacity = events.reduce(
      (sum, event) => sum + event.capacity,
      0,
    );
    const totalReserved = events.reduce(
      (sum, event) => sum + event.reservedSeats,
      0,
    );

    const fillRate =
      totalCapacity > 0 ? (totalReserved / totalCapacity) * 100 : 0;

    return {
      totalCapacity,
      totalReserved,
      fillRate: Math.round(fillRate * 100) / 100,
      availableSeats: totalCapacity - totalReserved,
    };
  }

  async getReservationsByStatus() {
    const reservations = await this.reservationsRepository.find();

    const pending = reservations.filter(
      (r) => r.status === ReservationStatus.PENDING,
    ).length;
    const confirmed = reservations.filter(
      (r) => r.status === ReservationStatus.CONFIRMED,
    ).length;
    const refused = reservations.filter(
      (r) => r.status === ReservationStatus.REFUSED,
    ).length;
    const canceled = reservations.filter(
      (r) => r.status === ReservationStatus.CANCELED,
    ).length;

    return {
      total: reservations.length,
      pending,
      confirmed,
      refused,
      canceled,
    };
  }

  async getDashboard() {
    const upcomingEvents = await this.getUpcomingEvents();
    const fillRate = await this.getFillRate();
    const reservationsByStatus = await this.getReservationsByStatus();

    return {
      upcomingEvents,
      fillRate,
      reservationsByStatus,
    };
  }
}
