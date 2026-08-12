import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const passwordHash = await bcrypt.hash('demo1234', 10);

  const owner = await prisma.user.upsert({
    where: { email: 'demo@invoicegen.com' },
    update: {},
    create: {
      email: 'demo@invoicegen.com',
      password: passwordHash,
      name: 'Demo User',
      role: 'OWNER',
    },
  });

  const accountant = await prisma.user.upsert({
    where: { email: 'accountant@invoicegen.com' },
    update: {},
    create: {
      email: 'accountant@invoicegen.com',
      password: passwordHash,
      name: 'Jane Accountant',
      role: 'ACCOUNTANT',
    },
  });

  const company = await prisma.company.upsert({
    where: { userId: owner.id },
    update: {},
    create: {
      userId: owner.id,
      name: 'Acme Solutions Ltd',
      address: '123 Business Street',
      city: 'San Francisco',
      country: 'USA',
      postalCode: '94101',
      email: 'billing@acmesolutions.com',
      phone: '+1 555-0100',
      taxId: 'US-12345678',
      bankName: 'First National Bank',
      bankAccount: '1234567890',
      bankSwift: 'FNBAUS33',
      invoicePrefix: 'INV',
      invoiceStart: 1001,
    },
  });

  const clients = await Promise.all([
    prisma.client.create({
      data: {
        userId: owner.id,
        name: 'John Smith',
        company: 'Smith & Co',
        email: 'john@smithco.com',
        address: '456 Oak Avenue',
        city: 'New York',
        country: 'USA',
        phone: '+1 555-0200',
      },
    }),
    prisma.client.create({
      data: {
        userId: owner.id,
        name: 'Sarah Johnson',
        company: 'Johnson Enterprises',
        email: 'sarah@johnsonent.com',
        address: '789 Pine Road',
        city: 'Los Angeles',
        country: 'USA',
        phone: '+1 555-0300',
      },
    }),
    prisma.client.create({
      data: {
        userId: owner.id,
        name: 'Michael Chen',
        company: 'Chen Technologies',
        email: 'michael@chentech.com',
        address: '321 Elm Street',
        city: 'Seattle',
        country: 'USA',
        phone: '+1 555-0400',
      },
    }),
  ]);

  const now = new Date();
  const invoices = [
    {
      number: 'INV-1001',
      userId: owner.id,
      clientId: clients[0].id,
      status: 'PAID' as const,
      issueDate: new Date(now.getFullYear(), now.getMonth() - 2, 15),
      dueDate: new Date(now.getFullYear(), now.getMonth() - 1, 15),
      currency: 'USD',
      paidAt: new Date(now.getFullYear(), now.getMonth() - 1, 10),
      items: [
        { description: 'Web Development Services', quantity: 40, unit: 'hrs', unitPrice: 75, taxRate: 0, discount: 0, total: 3000 },
        { description: 'Server Setup', quantity: 1, unit: 'pcs', unitPrice: 500, taxRate: 0, discount: 0, total: 500 },
      ],
    },
    {
      number: 'INV-1002',
      userId: owner.id,
      clientId: clients[1].id,
      status: 'SENT' as const,
      issueDate: new Date(now.getFullYear(), now.getMonth() - 1, 1),
      dueDate: new Date(now.getFullYear(), now.getMonth(), 1),
      currency: 'USD',
      sentAt: new Date(now.getFullYear(), now.getMonth() - 1, 2),
      items: [
        { description: 'Consulting Services', quantity: 20, unit: 'hrs', unitPrice: 100, taxRate: 10, discount: 0, total: 2200 },
      ],
    },
    {
      number: 'INV-1003',
      userId: owner.id,
      clientId: clients[2].id,
      status: 'OVERDUE' as const,
      issueDate: new Date(now.getFullYear(), now.getMonth() - 3, 1),
      dueDate: new Date(now.getFullYear(), now.getMonth() - 2, 1),
      currency: 'USD',
      items: [
        { description: 'Mobile App Development', quantity: 60, unit: 'hrs', unitPrice: 80, taxRate: 10, discount: 200, total: 5080 },
        { description: 'UI/UX Design', quantity: 15, unit: 'hrs', unitPrice: 60, taxRate: 10, discount: 0, total: 990 },
      ],
    },
    {
      number: 'INV-1004',
      userId: owner.id,
      clientId: clients[0].id,
      status: 'DRAFT' as const,
      issueDate: new Date(now.getFullYear(), now.getMonth(), 1),
      dueDate: new Date(now.getFullYear(), now.getMonth() + 1, 1),
      currency: 'USD',
      items: [
        { description: 'Monthly Maintenance', quantity: 1, unit: 'pcs', unitPrice: 800, taxRate: 0, discount: 0, total: 800 },
      ],
    },
  ];

  for (const inv of invoices) {
    const { items, ...invData } = inv;
    const subtotal = items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
    const discountTotal = items.reduce((s, i) => s + i.discount, 0);
    const taxTotal = items.reduce((s, i) => s + (i.quantity * i.unitPrice - i.discount) * (i.taxRate / 100), 0);
    const total = subtotal - discountTotal + taxTotal;

    await prisma.invoice.create({
      data: {
        ...invData,
        subtotal,
        taxTotal,
        discountTotal,
        total,
        items: { create: items },
      },
    });
  }

  await prisma.template.createMany({
    data: [
      { userId: owner.id, name: 'Web Development', description: 'Standard web development hourly rate', quantity: 40, unit: 'hrs', unitPrice: 75, taxRate: 0, discount: 0 },
      { userId: owner.id, name: 'Consulting', description: 'Business consulting per hour', quantity: 1, unit: 'hrs', unitPrice: 100, taxRate: 10, discount: 0 },
      { userId: owner.id, name: 'Server Setup', description: 'One-time server configuration', quantity: 1, unit: 'pcs', unitPrice: 500, taxRate: 0, discount: 0 },
      { userId: owner.id, name: 'Monthly Maintenance', description: 'Monthly server maintenance retainer', quantity: 1, unit: 'pcs', unitPrice: 800, taxRate: 0, discount: 0 },
    ],
  });

  console.log('Seed data created successfully!');
  console.log(`  Users: ${owner.email}, ${accountant.email}`);
  console.log(`  Company: ${company.name}`);
  console.log(`  Clients: ${clients.length}`);
  console.log(`  Invoices: ${invoices.length}`);
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
