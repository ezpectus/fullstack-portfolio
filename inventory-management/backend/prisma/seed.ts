import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const adminPassword = await bcrypt.hash('admin1234', 10);
  const managerPassword = await bcrypt.hash('manager1234', 10);
  const staffPassword = await bcrypt.hash('demo1234', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@inventory.com' },
    update: {},
    create: { email: 'admin@inventory.com', password: adminPassword, name: 'Admin User', role: 'ADMIN' },
  });

  const manager = await prisma.user.upsert({
    where: { email: 'manager@inventory.com' },
    update: {},
    create: { email: 'manager@inventory.com', password: managerPassword, name: 'Warehouse Manager', role: 'MANAGER' },
  });

  const staff = await prisma.user.upsert({
    where: { email: 'demo@inventory.com' },
    update: {},
    create: { email: 'demo@inventory.com', password: staffPassword, name: 'Demo Staff', role: 'STAFF' },
  });

  const electronics = await prisma.category.create({ data: { name: 'Electronics' } });
  const office = await prisma.category.create({ data: { name: 'Office Supplies' } });
  const components = await prisma.category.create({ data: { name: 'Components', parentId: electronics.id } });

  const warehouse1 = await prisma.warehouse.create({
    data: { name: 'Main Warehouse', address: '123 Industrial Blvd', managerId: manager.id },
  });
  const warehouse2 = await prisma.warehouse.create({
    data: { name: 'Secondary Warehouse', address: '456 Storage Ave' },
  });

  const supplier1 = await prisma.supplier.create({
    data: { name: 'Tech Supplies Inc.', contact: 'John Doe', email: 'john@techsupplies.com', phone: '555-0100' },
  });
  const supplier2 = await prisma.supplier.create({
    data: { name: 'Global Components Ltd.', contact: 'Jane Smith', email: 'jane@globalcomp.com', phone: '555-0200' },
  });

  const product1 = await prisma.product.create({
    data: {
      sku: 'LAPTOP-001',
      name: 'Dell Latitude Laptop',
      description: '14-inch business laptop',
      categoryId: electronics.id,
      unit: 'pcs',
      minStock: 5,
      costPrice: 800,
      sellPrice: 1200,
      barcode: 'LAPTOP001',
    },
  });

  const product2 = await prisma.product.create({
    data: {
      sku: 'MOUSE-001',
      name: 'Wireless Mouse',
      description: 'Ergonomic wireless mouse',
      categoryId: electronics.id,
      unit: 'pcs',
      minStock: 10,
      costPrice: 15,
      sellPrice: 35,
      barcode: 'MOUSE001',
    },
  });

  const product3 = await prisma.product.create({
    data: {
      sku: 'PAPER-A4',
      name: 'A4 Paper Ream',
      description: '500 sheets, 80gsm',
      categoryId: office.id,
      unit: 'box',
      minStock: 20,
      costPrice: 5,
      sellPrice: 12,
      barcode: 'PAPERA4',
    },
  });

  const product4 = await prisma.product.create({
    data: {
      sku: 'SSD-256',
      name: '256GB SSD Drive',
      description: 'SATA III 2.5-inch SSD',
      categoryId: components.id,
      unit: 'pcs',
      minStock: 8,
      costPrice: 45,
      sellPrice: 89,
      barcode: 'SSD256',
    },
  });

  await prisma.stockMovement.createMany({
    data: [
      { productId: product1.id, warehouseId: warehouse1.id, type: 'IN', quantity: 20, userId: admin.id, comment: 'Initial stock' },
      { productId: product2.id, warehouseId: warehouse1.id, type: 'IN', quantity: 50, userId: admin.id, comment: 'Initial stock' },
      { productId: product3.id, warehouseId: warehouse2.id, type: 'IN', quantity: 100, userId: manager.id, comment: 'Initial stock' },
      { productId: product4.id, warehouseId: warehouse1.id, type: 'IN', quantity: 30, userId: manager.id, comment: 'Initial stock' },
      { productId: product2.id, warehouseId: warehouse1.id, type: 'OUT', quantity: 5, userId: staff.id, comment: 'Sold to customer' },
    ],
  });

  const po = await prisma.purchaseOrder.create({
    data: {
      poNumber: 'PO-20250101-0001',
      supplierId: supplier1.id,
      warehouseId: warehouse1.id,
      userId: admin.id,
      status: 'SENT',
      total: 1600,
      items: {
        create: [
          { productId: product1.id, quantity: 2, unitPrice: 800, totalPrice: 1600 },
        ],
      },
    },
  });

  console.log('Seed data created successfully!');
  console.log('Demo credentials:');
  console.log('  Admin:    admin@inventory.com / admin1234');
  console.log('  Manager:  manager@inventory.com / manager1234');
  console.log('  Staff:    demo@inventory.com / demo1234');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
