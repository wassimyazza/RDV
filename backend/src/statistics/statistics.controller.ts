import { Controller, Get, UseGuards } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('statistics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class StatisticsController {
  constructor(private statisticsService: StatisticsService) {}

  @Get('dashboard')
  getDashboard() {
    return this.statisticsService.getDashboard();
  }

  @Get('upcoming-events')
  getUpcomingEvents() {
    return this.statisticsService.getUpcomingEvents();
  }

  @Get('fill-rate')
  getFillRate() {
    return this.statisticsService.getFillRate();
  }

  @Get('reservations-by-status')
  getReservationsByStatus() {
    return this.statisticsService.getReservationsByStatus();
  }
}
