import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { Event } from './entities/event.entity';
import { EventStatus } from '../enums/event-status.enum';

describe('EventsService', () => {
  let service: EventsService;
  let mockRepository;

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getRepositoryToken(Event),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an event', async () => {
    const eventDto = {
      title: 'Test Event',
      description: 'Description',
      date: '2026-03-15T10:00:00',
      location: 'Location',
      capacity: 30,
    };

    const savedEvent = { id: '1', ...eventDto, status: EventStatus.DRAFT };
    mockRepository.create.mockReturnValue(savedEvent);
    mockRepository.save.mockResolvedValue(savedEvent);

    const result = await service.create(eventDto);

    expect(result.title).toBe(eventDto.title);
  });

  it('should find published events', async () => {
    const events = [
      { id: '1', status: EventStatus.PUBLISHED },
      { id: '2', status: EventStatus.PUBLISHED },
    ];

    mockRepository.find.mockResolvedValue(events);

    const result = await service.findPublished();

    expect(result.length).toBe(2);
  });
});