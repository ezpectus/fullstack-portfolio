import PDFDocument from 'pdfkit';

export function generatePayslipPDF(data: {
  employeeName: string;
  position: string;
  department: string;
  month: number;
  year: number;
  baseSalary: number;
  bonus: number;
  allowances: number;
  deductions: number;
  total: number;
}): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks: Buffer[] = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.fontSize(20).text('HR Portal — Payslip', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12);
    doc.text(`Employee: ${data.employeeName}`);
    doc.text(`Position: ${data.position}`);
    doc.text(`Department: ${data.department}`);
    doc.text(`Period: ${data.month}/${data.year}`);
    doc.moveDown();

    doc.text(`Base Salary: $${data.baseSalary.toFixed(2)}`);
    doc.text(`Bonus: $${data.bonus.toFixed(2)}`);
    doc.text(`Allowances: $${data.allowances.toFixed(2)}`);
    doc.text(`Deductions: -$${data.deductions.toFixed(2)}`);
    doc.moveDown();
    doc.fontSize(14).text(`Total: $${data.total.toFixed(2)}`);

    doc.end();
  });
}

export function generateCertificatePDF(data: {
  employeeName: string;
  position: string;
  department: string;
  hireDate: string;
  companyName: string;
}): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks: Buffer[] = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.fontSize(20).text('Certificate of Employment', { align: 'center' });
    doc.moveDown(2);
    doc.fontSize(12);
    doc.text(`This is to certify that ${data.employeeName} is employed at ${data.companyName}`);
    doc.text(`as ${data.position} in the ${data.department} department.`);
    doc.text(`Employment start date: ${data.hireDate}`);
    doc.moveDown(2);
    doc.text('This certificate is issued upon request.', { align: 'center' });

    doc.end();
  });
}
