import PDFDocument from 'pdfkit';
import { Response } from 'express';
import { prisma } from '../../config/db';
import { NotFoundError } from '../../shared/errors';

export class PdfService {
  async generateInvoicePdf(userId: string, invoiceId: string, res: Response) {
    const invoice = await prisma.invoice.findFirst({
      where: { id: invoiceId, userId },
      include: { items: true, client: true, user: { select: { name: true, email: true } } },
    });
    if (!invoice) throw new NotFoundError('Invoice');

    const company = await prisma.company.findUnique({ where: { userId } });

    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${invoice.number}.pdf"`);
    doc.pipe(res);

    const pageWidth = doc.page.width;
    const margin = 50;

    if (company?.logo) {
      try {
        doc.image(company.logo, margin, margin, { width: 120 });
      } catch {
        doc.fontSize(20).text(company?.name || 'Company', margin, margin);
      }
    } else {
      doc.fontSize(20).text(company?.name || 'Company', margin, margin);
    }

    doc.fontSize(20).fillColor('#1a7a4c').text('INVOICE', pageWidth - margin - 100, margin, { width: 100, align: 'right' });
    doc.moveDown();
    doc.fontSize(10).fillColor('#666').text(`#${invoice.number}`, pageWidth - margin - 100, margin + 30, { width: 100, align: 'right' });

    doc.moveDown(2);
    doc.fontSize(10).fillColor('#333');
    doc.text(`Issue Date: ${invoice.issueDate.toLocaleDateString()}`, margin, 120);
    doc.text(`Due Date: ${invoice.dueDate.toLocaleDateString()}`, margin, 135);

    doc.text('Bill To:', margin, 170);
    doc.fontSize(11).fillColor('#000');
    doc.text(invoice.client.name, margin, 185);
    if (invoice.client.company) doc.text(invoice.client.company, margin, 200);
    doc.text(invoice.client.email, margin, 215);
    if (invoice.client.address) doc.text(invoice.client.address, margin, 230);

    const tableTop = 280;
    doc.fontSize(10).fillColor('#666');
    doc.text('Description', margin, tableTop);
    doc.text('Qty', margin + 250, tableTop);
    doc.text('Unit Price', margin + 300, tableTop);
    doc.text('Tax %', margin + 370, tableTop);
    doc.text('Total', pageWidth - margin - 80, tableTop, { width: 80, align: 'right' });

    doc.moveTo(margin, tableTop + 15).lineTo(pageWidth - margin, tableTop + 15).strokeColor('#ddd').stroke();

    let y = tableTop + 30;
    doc.fillColor('#333');
    for (const item of invoice.items) {
      doc.text(item.description, margin, y, { width: 240 });
      doc.text(String(item.quantity), margin + 250, y);
      doc.text(`$${item.unitPrice.toFixed(2)}`, margin + 300, y);
      doc.text(`${item.taxRate}%`, margin + 370, y);
      doc.text(`$${item.total.toFixed(2)}`, pageWidth - margin - 80, y, { width: 80, align: 'right' });
      y += 25;
    }

    doc.moveTo(margin, y).lineTo(pageWidth - margin, y).strokeColor('#ddd').stroke();
    y += 20;

    const rightCol = pageWidth - margin - 200;
    doc.fontSize(10).fillColor('#666');
    doc.text('Subtotal:', rightCol, y);
    doc.fillColor('#333').text(`$${invoice.subtotal.toFixed(2)}`, pageWidth - margin - 80, y, { width: 80, align: 'right' });
    y += 20;

    if (invoice.discountTotal > 0) {
      doc.fillColor('#666').text('Discount:', rightCol, y);
      doc.fillColor('#333').text(`-$${invoice.discountTotal.toFixed(2)}`, pageWidth - margin - 80, y, { width: 80, align: 'right' });
      y += 20;
    }

    doc.fillColor('#666').text('Tax:', rightCol, y);
    doc.fillColor('#333').text(`$${invoice.taxTotal.toFixed(2)}`, pageWidth - margin - 80, y, { width: 80, align: 'right' });
    y += 20;

    doc.moveTo(rightCol, y).lineTo(pageWidth - margin, y).strokeColor('#ddd').stroke();
    y += 15;

    doc.fontSize(14).fillColor('#1a7a4c').text('Total:', rightCol, y);
    doc.text(`$${invoice.total.toFixed(2)} ${invoice.currency}`, pageWidth - margin - 80, y, { width: 80, align: 'right' });

    if (invoice.notes) {
      y += 40;
      doc.fontSize(9).fillColor('#666').text('Notes:', margin, y);
      doc.text(invoice.notes, margin, y + 15, { width: pageWidth - 2 * margin });
    }

    if (company?.bankName || company?.bankAccount) {
      y += 50;
      doc.fontSize(9).fillColor('#666').text('Payment Details:', margin, y);
      if (company.bankName) doc.text(`Bank: ${company.bankName}`, margin, y + 15);
      if (company.bankAccount) doc.text(`Account: ${company.bankAccount}`, margin, y + 30);
      if (company.bankSwift) doc.text(`SWIFT: ${company.bankSwift}`, margin, y + 45);
    }

    doc.end();
  }
}

export const pdfService = new PdfService();
