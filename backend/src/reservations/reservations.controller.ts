import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  Request,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('reservations')
@UseGuards(JwtAuthGuard)
export class ReservationsController {
  constructor(private reservationsService: ReservationsService) {}

  @Post()
  @Roles('PARTICIPANT')
  @UseGuards(RolesGuard)
  create(@Request() req, @Body() createReservationDto: CreateReservationDto) {
    return this.reservationsService.create(req.user.id, createReservationDto);
  }

  @Get()
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  findAll() {
    return this.reservationsService.findAll();
  }

  @Get('my-reservations')
  findMyReservations(@Request() req) {
    return this.reservationsService.findByUser(req.user.id);
  }

  @Get('event/:eventId')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  findByEvent(@Param('eventId') eventId: string) {
    return this.reservationsService.findByEvent(eventId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(id);
  }

  @Get(':id/download-ticket')
  async downloadTicket(
    @Request() req,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const pdfBuffer = await this.reservationsService.downloadTicket(
      id,
      req.user.id,
    );

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=ticket-${id}.pdf`,
      'Content-Length': pdfBuffer.length,
    });

    res.end(pdfBuffer);
  }

  @Patch(':id/confirm')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  confirm(@Param('id') id: string) {
    return this.reservationsService.confirm(id);
  }

  @Patch(':id/refuse')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  refuse(@Param('id') id: string) {
    return this.reservationsService.refuse(id);
  }

  @Patch(':id/cancel')
  cancel(@Request() req, @Param('id') id: string) {
    return this.reservationsService.cancel(id, req.user.id);
  }

  @Patch(':id/cancel-admin')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  cancelByAdmin(@Param('id') id: string) {
    return this.reservationsService.cancelByAdmin(id);
  }
}
