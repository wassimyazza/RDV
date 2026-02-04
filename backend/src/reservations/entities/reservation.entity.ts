import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ReservationStatus } from '../../enums/reservation-status.enum';
import { User } from '../../users/entities/user.entity';
import { Event } from '../../events/entities/event.entity';

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  eventId: string;

  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.PENDING,
  })
  status: ReservationStatus;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Event)
  @JoinColumn({ name: 'eventId' })
  event: Event;

  @CreateDateColumn()
  createdAt: Date;
}
