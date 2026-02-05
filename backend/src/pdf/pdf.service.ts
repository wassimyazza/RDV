import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { Reservation } from '../reservations/entities/reservation.entity';

@Injectable()
export class PdfService {
  generateTicket(reservation: Reservation): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });
      doc.on('error', reject);

      doc.fontSize(25).text('Event Ticket', { align: 'center' });
      doc.moveDown();

      doc
        .fontSize(16)
        .text(`Event: ${reservation.event.title}`, { align: 'left' });
      doc.moveDown(0.5);

      doc
        .fontSize(12)
        .text(
          `Participant: ${reservation.user.firstName} ${reservation.user.lastName}`,
        );
      doc.text(`Email: ${reservation.user.email}`);
      doc.text(`Location: ${reservation.event.location}`);
      doc.text(`Date: ${new Date(reservation.event.date).toLocaleString()}`);
      doc.moveDown();

      doc.text(`Reservation ID: ${reservation.id}`);
      doc.text(`Status: ${reservation.status}`);
      doc.moveDown();

      doc
        .fontSize(10)
        .text('Please present this ticket at the event entrance.', {
          align: 'center',
        });

      doc.end();
    });
  }
}
