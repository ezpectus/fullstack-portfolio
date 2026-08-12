import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const adminPassword = await bcrypt.hash('demo1234', 10);
  const userPassword = await bcrypt.hash('user1234', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'demo@urlshortener.com' },
    update: {},
    create: {
      email: 'demo@urlshortener.com',
      password: adminPassword,
      name: 'Demo Admin',
      role: 'admin',
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@urlshortener.com' },
    update: {},
    create: {
      email: 'user@urlshortener.com',
      password: userPassword,
      name: 'Regular User',
      role: 'user',
    },
  });

  await prisma.settings.upsert({
    where: { userId: admin.id },
    update: {},
    create: {
      userId: admin.id,
      domain: 'localhost',
      codeLength: 6,
      blacklist: [],
    },
  });

  await prisma.settings.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      domain: 'localhost',
      codeLength: 6,
      blacklist: [],
    },
  });

  const links = [
    { originalUrl: 'https://github.com/lukas-c-2k', shortCode: 'ghluk', alias: 'github', userId: admin.id },
    { originalUrl: 'https://www.typescriptlang.org/docs/', shortCode: 'tsdoc', alias: 'tsdocs', userId: admin.id },
    { originalUrl: 'https://react.dev/learn', shortCode: 'rctln', alias: 'react-learn', userId: user.id },
    { originalUrl: 'https://tailwindcss.com/docs/installation', shortCode: 'twcss', alias: 'tw-docs', userId: user.id },
    { originalUrl: 'https://www.prisma.io/docs', shortCode: 'prsdcs', userId: admin.id },
  ];

  for (const link of links) {
    await prisma.shortLink.upsert({
      where: { shortCode: link.shortCode },
      update: {},
      create: link,
    });
  }

  const allLinks = await prisma.shortLink.findMany();
  const devices = ['desktop', 'mobile', 'tablet'];
  const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge'];
  const countries = ['United States', 'Germany', 'India', 'Brazil', 'Japan'];
  const cities = ['New York', 'Berlin', 'Mumbai', 'São Paulo', 'Tokyo'];

  for (const link of allLinks) {
    const clickCount = Math.floor(Math.random() * 50) + 5;
    for (let i = 0; i < clickCount; i++) {
      const daysAgo = Math.floor(Math.random() * 30);
      await prisma.click.create({
        data: {
          shortLinkId: link.id,
          ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          referer: Math.random() > 0.5 ? 'https://google.com' : null,
          country: countries[Math.floor(Math.random() * countries.length)],
          city: cities[Math.floor(Math.random() * cities.length)],
          device: devices[Math.floor(Math.random() * devices.length)],
          browser: browsers[Math.floor(Math.random() * browsers.length)],
          isUnique: Math.random() > 0.3,
          createdAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
        },
      });
    }
  }

  console.log('Seed completed successfully!');
  console.log(`  Admin: demo@urlshortener.com / demo1234`);
  console.log(`  User:  user@urlshortener.com / user1234`);
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
