import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const adminPassword = await bcrypt.hash('admin123', 10);
  const providerPassword = await bcrypt.hash('provider123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@booking.com' },
    update: {},
    create: { email: 'admin@booking.com', password: adminPassword, name: 'System Admin', role: 'ADMIN' },
  });

  const providerUser = await prisma.user.upsert({
    where: { email: 'jane@booking.com' },
    update: {},
    create: { email: 'jane@booking.com', password: providerPassword, name: 'Jane Doe', role: 'PROVIDER' },
  });

  const provider2User = await prisma.user.upsert({
    where: { email: 'mike@booking.com' },
    update: {},
    create: { email: 'mike@booking.com', password: providerPassword, name: 'Mike Smith', role: 'PROVIDER' },
  });

  const provider1 = await prisma.provider.create({
    data: { userId: providerUser.id, bio: 'Experienced hair stylist with 10+ years' },
  });

  const provider2 = await prisma.provider.create({
    data: { userId: provider2User.id, bio: 'Massage therapist specializing in deep tissue' },
  });

  const hairCategory = await prisma.serviceCategory.create({
    data: { name: 'Hair', slug: 'hair' },
  });

  const massageCategory = await prisma.serviceCategory.create({
    data: { name: 'Massage', slug: 'massage' },
  });

  const service1 = await prisma.service.create({
    data: {
      name: 'Haircut & Style',
      description: 'Professional haircut with styling',
      duration: 60,
      price: 50,
      isActive: true,
      categoryId: hairCategory.id,
    },
  });

  const service2 = await prisma.service.create({
    data: {
      name: 'Deep Tissue Massage',
      description: 'Full body deep tissue massage',
      duration: 90,
      price: 120,
      isActive: true,
      categoryId: massageCategory.id,
    },
  });

  await prisma.serviceProvider.createMany({
    data: [
      { serviceId: service1.id, providerId: provider1.id },
      { serviceId: service2.id, providerId: provider2.id },
    ],
  });

  await prisma.workingHours.createMany({
    data: [
      { providerId: provider1.id, dayOfWeek: 1, startTime: '09:00', endTime: '17:00' },
      { providerId: provider1.id, dayOfWeek: 2, startTime: '09:00', endTime: '17:00' },
      { providerId: provider1.id, dayOfWeek: 3, startTime: '09:00', endTime: '17:00' },
      { providerId: provider1.id, dayOfWeek: 4, startTime: '09:00', endTime: '17:00' },
      { providerId: provider1.id, dayOfWeek: 5, startTime: '09:00', endTime: '17:00' },
      { providerId: provider2.id, dayOfWeek: 1, startTime: '10:00', endTime: '18:00' },
      { providerId: provider2.id, dayOfWeek: 2, startTime: '10:00', endTime: '18:00' },
      { providerId: provider2.id, dayOfWeek: 3, startTime: '10:00', endTime: '18:00' },
      { providerId: provider2.id, dayOfWeek: 4, startTime: '10:00', endTime: '18:00' },
      { providerId: provider2.id, dayOfWeek: 5, startTime: '10:00', endTime: '18:00' },
    ],
  });

  const customer1 = await prisma.customer.create({
    data: { name: 'Alice Johnson', email: 'alice@example.com', phone: '+1234567890' },
  });

  const customer2 = await prisma.customer.create({
    data: { name: 'Bob Wilson', email: 'bob@example.com', phone: '+0987654321' },
  });

  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);

  const endTime = new Date(tomorrow);
  endTime.setHours(11, 0, 0, 0);

  await prisma.booking.create({
    data: {
      bookingNumber: 'BK-000001',
      serviceId: service1.id,
      providerId: provider1.id,
      customerId: customer1.id,
      status: 'CONFIRMED',
      startTime: tomorrow,
      endTime,
      price: 50,
    },
  });

  await prisma.businessSettings.createMany({
    data: [
      { key: 'business_name', value: 'BookWell' },
      { key: 'business_email', value: 'contact@bookwell.com' },
      { key: 'business_phone', value: '+1234567890' },
      { key: 'timezone', value: 'UTC' },
      { key: 'cancellation_policy_hours', value: '24' },
      { key: 'buffer_time_minutes', value: '10' },
      { key: 'slot_interval_minutes', value: '30' },
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
