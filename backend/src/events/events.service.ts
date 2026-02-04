import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventStatus } from '../enums/event-status.enum';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {
    const event = this.eventsRepository.create(createEventDto);
    return this.eventsRepository.save(event);
  }

  async findAll(): Promise<Event[]> {
    return this.eventsRepository.find();
  }

  async findPublished(): Promise<Event[]> {
    return this.eventsRepository.find({
      where: { status: EventStatus.PUBLISHED },
    });
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.eventsRepository.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
    const event = await this.findOne(id);

    if (
      updateEventDto.capacity &&
      updateEventDto.capacity < event.reservedSeats
    ) {
      throw new BadRequestException(
        'Capacity cannot be less than reserved seats',
      );
    }

    Object.assign(event, updateEventDto);
    return this.eventsRepository.save(event);
  }

  async publish(id: string): Promise<Event> {
    const event = await this.findOne(id);
    event.status = EventStatus.PUBLISHED;
    return this.eventsRepository.save(event);
  }

  async cancel(id: string): Promise<Event> {
    const event = await this.findOne(id);
    event.status = EventStatus.CANCELED;
    return this.eventsRepository.save(event);
  }

  async remove(id: string): Promise<void> {
    const event = await this.findOne(id);
    await this.eventsRepository.remove(event);
  }

  async getAvailableSeats(id: string): Promise<number> {
    const event = await this.findOne(id);
    return event.capacity - event.reservedSeats;
  }
}
