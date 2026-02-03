import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
const request = require('supertest');

import { UsersModule } from '../src/users/users.module';
import { AuthModule } from '../src/auth/auth.module';
import { EventsModule } from '../src/events/events.module';
import { ReservationsModule } from '../src/reservations/reservations.module';
import { StatisticsModule } from '../src/statistics/statistics.module';

describe('E2E Complete Flow', () => {
  let app: INestApplication;
  let adminToken: string;
  let participantToken: string;
  let eventId: string;
  let reservationId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DB_HOST || 'localhost',
          port: parseInt(process.env.DB_PORT || '5435'),
          username: process.env.DB_USERNAME || 'postgres',
          password: process.env.DB_PASSWORD || 'postgres',
          database: process.env.DB_DATABASE + '_test' || 'rdv_events_test',
          autoLoadEntities: true,
          synchronize: true,
          dropSchema: true,
        }),
        UsersModule,
        AuthModule,
        EventsModule,
        ReservationsModule,
        StatisticsModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('should register an admin user', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/users/register')
      .send({
        email: 'admin@test.com',
        password: '123456',
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
      });

    expect(response.status).toBe(201);
    expect(response.body.email).toBe('admin@test.com');
    expect(response.body.role).toBe('ADMIN');
  });

  it('should register a participant user', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/users/register')
      .send({
        email: 'participant@test.com',
        password: '123456',
        firstName: 'Participant',
        lastName: 'User',
        role: 'PARTICIPANT',
      });

    expect(response.status).toBe(201);
    expect(response.body.email).toBe('participant@test.com');
    expect(response.body.role).toBe('PARTICIPANT');
  });

  it('should login admin and get token', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'admin@test.com',
        password: '123456',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('access_token');
    adminToken = response.body.access_token;
  });

  it('should login participant and get token', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'participant@test.com',
        password: '123456',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('access_token');
    participantToken = response.body.access_token;
  });

  it('should create an event as admin', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/events')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Formation NestJS',
        description: 'Apprendre NestJS',
        date: '2026-03-15T10:00:00',
        location: 'Casablanca',
        capacity: 30,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    eventId = response.body.id;
  });

  it('should publish the event as admin', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/api/events/${eventId}/publish`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('PUBLISHED');
  });

  it('should get published events', async () => {
    const response = await request(app.getHttpServer()).get(
      '/api/events/published',
    );

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should create a reservation as participant', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/reservations')
      .set('Authorization', `Bearer ${participantToken}`)
      .send({
        eventId: eventId,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    reservationId = response.body.id;
  });

  it('should get my reservations as participant', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/reservations/my-reservations')
      .set('Authorization', `Bearer ${participantToken}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should confirm reservation as admin', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/api/reservations/${reservationId}/confirm`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('CONFIRMED');
  });

  it('should get statistics as admin', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/statistics/dashboard')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('upcomingEvents');
    expect(response.body).toHaveProperty('fillRate');
    expect(response.body).toHaveProperty('reservationsByStatus');
  });
});
