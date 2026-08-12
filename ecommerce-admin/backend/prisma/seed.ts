import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const adminPassword = await bcrypt.hash('admin123', 10);
  const managerPassword = await bcrypt.hash('manager123', 10);
  const staffPassword = await bcrypt.hash('staff123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@ecommerce.com' },
    update: {},
    create: { email: 'admin@ecommerce.com', password: adminPassword, name: 'Super Admin', role: 'SUPER_ADMIN' },
  });

  const manager = await prisma.user.upsert({
    where: { email: 'manager@ecommerce.com' },
    update: {},
    create: { email: 'manager@ecommerce.com', password: managerPassword, name: 'Store Manager', role: 'MANAGER' },
  });

  await prisma.user.upsert({
    where: { email: 'staff@ecommerce.com' },
    update: {},
    create: { email: 'staff@ecommerce.com', password: staffPassword, name: 'Staff Member', role: 'STAFF' },
  });

  const electronics = await prisma.category.create({ data: { name: 'Electronics', slug: 'electronics' } });
  const clothing = await prisma.category.create({ data: { name: 'Clothing', slug: 'clothing' } });
  const phones = await prisma.category.create({ data: { name: 'Phones', slug: 'phones', parentId: electronics.id } });
  const laptops = await prisma.category.create({ data: { name: 'Laptops', slug: 'laptops', parentId: electronics.id } });

  const product1 = await prisma.product.create({
    data: {
      sku: 'PHONE-001',
      name: 'Premium Smartphone',
      description: 'Latest flagship smartphone with advanced camera',
      status: 'ACTIVE',
      price: 999.99,
      stock: 50,
      tags: ['smartphone', 'flagship', '5g'],
      slug: 'premium-smartphone',
      userId: admin.id,
      categoryId: phones.id,
      metaTitle: 'Premium Smartphone - Best Price',
      metaDescription: 'Get the latest flagship smartphone',
      variants: {
        create: [
          { sku: 'PHONE-001-BLK', name: 'Black 128GB', color: 'Black', price: 999.99, stock: 25 },
          { sku: 'PHONE-001-WHT', name: 'White 128GB', color: 'White', price: 999.99, stock: 25 },
        ],
      },
      images: {
        create: [
          { url: 'https://picsum.photos/seed/phone1/600/600', alt: 'Front view', position: 0 },
          { url: 'https://picsum.photos/seed/phone2/600/600', alt: 'Back view', position: 1 },
        ],
      },
    },
  });

  const product2 = await prisma.product.create({
    data: {
      sku: 'LAPTOP-001',
      name: 'UltraBook Pro',
      description: 'Lightweight laptop for professionals',
      status: 'ACTIVE',
      price: 1499.99,
      discountPrice: 1299.99,
      stock: 30,
      tags: ['laptop', 'ultrabook', 'professional'],
      slug: 'ultrabook-pro',
      userId: manager.id,
      categoryId: laptops.id,
      variants: {
        create: [
          { sku: 'LAPTOP-001-16', name: '16GB RAM', size: '16GB', price: 1299.99, stock: 15 },
          { sku: 'LAPTOP-001-32', name: '32GB RAM', size: '32GB', price: 1599.99, stock: 15 },
        ],
      },
    },
  });

  const customer1 = await prisma.customer.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      segment: 'VIP',
      totalSpend: 5000,
      addresses: {
        create: [{ street: '123 Main St', city: 'New York', state: 'NY', postalCode: '10001', isDefault: true }],
      },
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      segment: 'REGULAR',
      totalSpend: 1500,
    },
  });

  await prisma.promoCode.create({
    data: { code: 'SAVE10', type: 'PERCENTAGE', value: 10, minOrderValue: 100, usageLimit: 100, isActive: true },
  });

  await prisma.promoCode.create({
    data: { code: 'FLAT50', type: 'FIXED', value: 50, minOrderValue: 200, usageLimit: 50, isActive: true },
  });

  await prisma.order.create({
    data: {
      orderNumber: 'ORD-20260810-0001',
      customerId: customer1.id,
      status: 'DELIVERED',
      paymentStatus: 'PAID',
      subtotal: 2499.98,
      taxTotal: 250.0,
      shippingTotal: 0,
      discountTotal: 0,
      total: 2749.98,
      items: {
        create: [
          { productId: product1.id, quantity: 1, unitPrice: 999.99, totalPrice: 999.99 },
          { productId: product2.id, quantity: 1, unitPrice: 1299.99, totalPrice: 1299.99 },
        ],
      },
      statusHistory: {
        create: [
          { status: 'PENDING' },
          { status: 'PROCESSING', userId: manager.id },
          { status: 'SHIPPED', userId: manager.id },
          { status: 'DELIVERED', userId: admin.id },
        ],
      },
    },
  });

  await prisma.settings.createMany({
    data: [
      { key: 'store_name', value: 'ShopHub' },
      { key: 'store_email', value: 'contact@shophub.com' },
      { key: 'store_phone', value: '+1234567890' },
      { key: 'default_currency', value: 'USD' },
      { key: 'tax_rate', value: '0.10' },
    ],
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
