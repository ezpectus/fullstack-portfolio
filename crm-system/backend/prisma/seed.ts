import { PrismaClient, UserRole, CustomerStatus, DealStage } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const adminPassword = await bcrypt.hash('demo1234', 10);
  const managerPassword = await bcrypt.hash('manager123', 10);
  const repPassword = await bcrypt.hash('rep12345', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'demo@crm.com' },
    update: {},
    create: {
      email: 'demo@crm.com',
      password: adminPassword,
      name: 'Demo Admin',
      role: UserRole.admin,
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: 'manager@crm.com' },
    update: {},
    create: {
      email: 'manager@crm.com',
      password: managerPassword,
      name: 'Jane Manager',
      role: UserRole.manager,
    },
  });

  const salesRep = await prisma.user.upsert({
    where: { email: 'rep@crm.com' },
    update: {},
    create: {
      email: 'rep@crm.com',
      password: repPassword,
      name: 'Bob Sales',
      role: UserRole.sales_rep,
    },
  });

  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        name: 'Acme Corporation',
        company: 'Acme Corp',
        email: 'contact@acme.com',
        phone: '+1-555-0100',
        status: CustomerStatus.active,
        tags: ['enterprise', 'vip'],
        assignedToId: salesRep.id,
      },
    }),
    prisma.customer.create({
      data: {
        name: 'TechStart Inc',
        company: 'TechStart',
        email: 'hello@techstart.io',
        phone: '+1-555-0101',
        status: CustomerStatus.lead,
        tags: ['startup'],
        assignedToId: salesRep.id,
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Global Logistics Ltd',
        company: 'Global Logistics',
        email: 'info@globallog.com',
        phone: '+1-555-0102',
        status: CustomerStatus.active,
        tags: ['enterprise'],
        assignedToId: manager.id,
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Green Energy Co',
        company: 'Green Energy',
        email: 'sales@greenenergy.com',
        phone: '+1-555-0103',
        status: CustomerStatus.inactive,
        tags: ['energy'],
        assignedToId: salesRep.id,
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Blue Ocean Trading',
        company: 'Blue Ocean',
        email: 'team@blueocean.com',
        phone: '+1-555-0104',
        status: CustomerStatus.lead,
        tags: ['trading', 'vip'],
        assignedToId: manager.id,
      },
    }),
  ]);

  const deals = await Promise.all([
    prisma.deal.create({
      data: {
        title: 'Acme — Enterprise License',
        amount: 50000,
        currency: 'USD',
        stage: DealStage.proposal,
        probability: 75,
        expectedCloseDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        customerId: customers[0].id,
        assignedToId: salesRep.id,
      },
    }),
    prisma.deal.create({
      data: {
        title: 'Acme — Support Package',
        amount: 12000,
        currency: 'USD',
        stage: DealStage.qualified,
        probability: 50,
        customerId: customers[0].id,
        assignedToId: salesRep.id,
      },
    }),
    prisma.deal.create({
      data: {
        title: 'TechStart — Starter Plan',
        amount: 5000,
        currency: 'USD',
        stage: DealStage.contacted,
        probability: 30,
        customerId: customers[1].id,
        assignedToId: salesRep.id,
      },
    }),
    prisma.deal.create({
      data: {
        title: 'Global Logistics — Fleet Management',
        amount: 85000,
        currency: 'USD',
        stage: DealStage.new,
        probability: 10,
        customerId: customers[2].id,
        assignedToId: manager.id,
      },
    }),
    prisma.deal.create({
      data: {
        title: 'Blue Ocean — Trading Platform',
        amount: 120000,
        currency: 'USD',
        stage: DealStage.won,
        probability: 100,
        customerId: customers[4].id,
        assignedToId: manager.id,
      },
    }),
  ]);

  await Promise.all([
    prisma.note.create({
      data: {
        content: 'Had a great call with Acme CEO. They are very interested in the enterprise plan.',
        isPinned: true,
        customerId: customers[0].id,
        dealId: deals[0].id,
        createdById: admin.id,
      },
    }),
    prisma.note.create({
      data: {
        content: 'TechStart is still evaluating. Follow up next week.',
        isPinned: false,
        customerId: customers[1].id,
        createdById: salesRep.id,
      },
    }),
    prisma.note.create({
      data: {
        content: 'Global Logistics wants a demo of the fleet management module.',
        isPinned: false,
        customerId: customers[2].id,
        createdById: manager.id,
      },
    }),
  ]);

  console.log('Seed data created successfully!');
  console.log('Demo accounts:');
  console.log('  Admin:    demo@crm.com / demo1234');
  console.log('  Manager:  manager@crm.com / manager123');
  console.log('  Sales Rep: rep@crm.com / rep12345');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
