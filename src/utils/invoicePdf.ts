import { jsPDF } from 'jspdf';
import type { Booking } from '../types';
import { formatCurrency, formatHour } from '../types';

export function downloadBookingInvoicePdf(booking: Booking): void {
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 48;
  let y = 56;

  // Header bar
  doc.setFillColor(9, 9, 11);
  doc.rect(0, 0, pageWidth, 112, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('StudioSpace', margin, 52);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(161, 161, 170);
  doc.text('Peer-to-Peer Creative Workspace & Production Studio Marketplace', margin, 72);
  doc.text('Confirmed Production Reservation Receipt', margin, 88);

  // Invoice metadata right-aligned
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(booking.invoiceNumber, pageWidth - margin, 52, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(161, 161, 170);
  doc.text(`Status: ${booking.status.toUpperCase()}`, pageWidth - margin, 70, { align: 'right' });
  doc.text(
    `Issued: ${new Date(booking.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })}`,
    pageWidth - margin,
    86,
    { align: 'right' }
  );

  y = 148;

  // Two-column billing details
  doc.setTextColor(113, 113, 122);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('BILLED TO CREATOR', margin, y);
  doc.text('STUDIO HOST & VENUE', pageWidth / 2 + 12, y);

  y += 18;
  doc.setTextColor(9, 9, 11);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(booking.userName, margin, y);
  doc.text(booking.studioTitle, pageWidth / 2 + 12, y);

  y += 16;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(63, 63, 70);
  doc.text(booking.userEmail, margin, y);
  doc.text(`Host: ${booking.hostName} (${booking.hostEmail})`, pageWidth / 2 + 12, y);

  y += 15;
  doc.text(`Reservation ID: ${booking.id}`, margin, y);
  doc.text(`${booking.studioCategory} — ${booking.studioLocation}`, pageWidth / 2 + 12, y);

  y += 34;

  // Reservation schedule band
  doc.setFillColor(244, 244, 245);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 64, 6, 6, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(113, 113, 122);
  doc.text('SHOOT DATE', margin + 18, y + 22);
  doc.text('CALL & WRAP WINDOW', margin + 180, y + 22);
  doc.text('TOTAL DURATION', margin + 370, y + 22);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11.5);
  doc.setTextColor(9, 9, 11);
  doc.text(booking.bookingDate, margin + 18, y + 44);
  doc.text(
    `${formatHour(booking.startHour)} – ${formatHour(booking.endHour)}`,
    margin + 180,
    y + 44
  );
  doc.text(
    `${booking.durationHours} ${booking.durationHours === 1 ? 'Hour' : 'Hours'}`,
    margin + 370,
    y + 44
  );

  y += 96;

  // Itemized Charges Table Header
  doc.setDrawColor(228, 228, 231);
  doc.setLineWidth(1);
  doc.line(margin, y, pageWidth - margin, y);
  y += 18;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(113, 113, 122);
  doc.text('LINE ITEM', margin, y);
  doc.text('RATE', pageWidth - margin - 170, y, { align: 'right' });
  doc.text('QTY', pageWidth - margin - 100, y, { align: 'right' });
  doc.text('AMOUNT', pageWidth - margin, y, { align: 'right' });

  y += 12;
  doc.line(margin, y, pageWidth - margin, y);
  y += 24;

  const studioSubtotal = booking.hourlyRate * booking.durationHours;

  // Row 1: Studio rental
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(9, 9, 11);
  doc.text(`Studio Workspace Rental — ${booking.studioTitle}`, margin, y);
  doc.text(`${formatCurrency(booking.hourlyRate)}/hr`, pageWidth - margin - 170, y, {
    align: 'right',
  });
  doc.text(`${booking.durationHours} hrs`, pageWidth - margin - 100, y, { align: 'right' });
  doc.text(formatCurrency(studioSubtotal), pageWidth - margin, y, { align: 'right' });

  y += 24;

  // Row 2: Refundable Security Deposit
  doc.text('Refundable Equipment & Facility Security Deposit', margin, y);
  doc.text(formatCurrency(booking.securityDeposit), pageWidth - margin - 170, y, {
    align: 'right',
  });
  doc.text('1', pageWidth - margin - 100, y, { align: 'right' });
  doc.text(formatCurrency(booking.securityDeposit), pageWidth - margin, y, { align: 'right' });

  y += 24;

  // Row 3: Host Liability Coverage
  doc.text('StudioSpace Production Liability Guarantee ($2M Policy)', margin, y);
  doc.text('Included', pageWidth - margin - 170, y, { align: 'right' });
  doc.text('1', pageWidth - margin - 100, y, { align: 'right' });
  doc.text('$0', pageWidth - margin, y, { align: 'right' });

  y += 18;
  doc.line(margin, y, pageWidth - margin, y);
  y += 28;

  // Total Row
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(9, 9, 11);
  doc.text('Total Reserved Amount', pageWidth - margin - 190, y);
  doc.setTextColor(29, 78, 216);
  doc.text(formatCurrency(booking.totalAmount), pageWidth - margin, y, { align: 'right' });

  if (booking.notes) {
    y += 44;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(113, 113, 122);
    doc.text('PRODUCTION NOTES', margin, y);
    y += 16;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(63, 63, 70);
    const wrapped = doc.splitTextToSize(booking.notes, pageWidth - margin * 2);
    doc.text(wrapped, margin, y);
  }

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 56;
  doc.setDrawColor(228, 228, 231);
  doc.line(margin, footerY - 16, pageWidth - margin, footerY - 16);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(113, 113, 122);
  doc.text(
    'Security deposits are automatically released within 48 hours of wrap inspection. Questions? support@studiospace.io',
    margin,
    footerY
  );
  doc.text('StudioSpace Inc. — Verified Booking Receipt', pageWidth - margin, footerY, {
    align: 'right',
  });

  doc.save(`${booking.invoiceNumber}.pdf`);
}
