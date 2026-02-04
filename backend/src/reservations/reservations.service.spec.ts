import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ReservationsService } from './reservations.service';
import { Reservation } from './entities/reservation.entity';
import { EventsService } from '../events/events.service';
import { PdfService } from '../pdf/pdf.service';
import { EventStatus } from '../enums/event-status.enum';
import { BadRequestException } from '@nestjs/common';

describe('ReservationsService', () => {
  let service: ReservationsService;
  let mockRepository;
  let mockEventsService;
  let mockPdfService;

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
    };

    mockEventsService = {
      findOne: jest.fn(),
      update: jest.fn(),
    };

    mockPdfService = {
      generateTicket: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationsService,
        {
          provide: getRepositoryToken(Reservation),
          useValue: mockRepository,
        },
        {
          provide: EventsService,
          useValue: mockEventsService,
        },
        {
          provide: PdfService,
          useValue: mockPdfService,
        },
      ],
    }).compile();

    service = module.get<ReservationsService>(ReservationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw error when event is full', async () => {
    const event = {
      id: '1',
      status: EventStatus.PUBLISHED,
      capacity: 30,
      reservedSeats: 30,
    };

    mockEventsService.findOne.mockResolvedValue(event);

    await expect(
      service.create('user1', { eventId: 'event1' }),
    ).rejects.toThrow(BadRequestException);
  });
});
