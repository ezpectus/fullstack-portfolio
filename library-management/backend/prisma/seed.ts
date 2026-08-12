import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10);
  const librarianPassword = await bcrypt.hash('lib123', 10);
  const memberPassword = await bcrypt.hash('member123', 10);

  const admin = await prisma.user.create({
    data: { email: 'admin@library.com', password: adminPassword, name: 'Admin User', role: 'ADMIN' },
  });

  const librarian = await prisma.user.create({
    data: { email: 'librarian@library.com', password: librarianPassword, name: 'Jane Librarian', role: 'LIBRARIAN' },
  });

  const memberUser = await prisma.user.create({
    data: { email: 'member@library.com', password: memberPassword, name: 'John Member', role: 'MEMBER' },
  });

  const member = await prisma.member.create({
    data: { userId: memberUser.id, cardNumber: 'LIB-001', phone: '555-0100', address: '123 Book St' },
  });

  const fiction = await prisma.category.create({ data: { name: 'Fiction' } });
  const scifi = await prisma.category.create({ data: { name: 'Science Fiction', parentId: fiction.id } });
  const nonfiction = await prisma.category.create({ data: { name: 'Non-Fiction' } });

  const book1 = await prisma.book.create({
    data: {
      isbn: '978-0-7653-2635-5',
      title: 'The Way of Kings',
      authors: 'Brandon Sanderson',
      publisher: 'Tor Books',
      publishYear: 2010,
      genre: 'Fantasy',
      description: 'Epic fantasy novel',
      categoryId: fiction.id,
    },
  });

  const book2 = await prisma.book.create({
    data: {
      isbn: '978-0-451-52993-3',
      title: '1984',
      authors: 'George Orwell',
      publisher: 'Signet Classic',
      publishYear: 1949,
      genre: 'Dystopian',
      description: 'Dystopian social science fiction',
      categoryId: fiction.id,
    },
  });

  const book3 = await prisma.book.create({
    data: {
      isbn: '978-0-06-112008-4',
      title: 'To Kill a Mockingbird',
      authors: 'Harper Lee',
      publisher: 'Harper Perennial',
      publishYear: 1960,
      genre: 'Classic',
      description: 'Classic novel about racial injustice',
      categoryId: fiction.id,
    },
  });

  const copy1 = await prisma.bookCopy.create({ data: { bookId: book1.id, code: 'COPY-001', condition: 'good' } });
  const copy2 = await prisma.bookCopy.create({ data: { bookId: book1.id, code: 'COPY-002', condition: 'fair' } });
  const copy3 = await prisma.bookCopy.create({ data: { bookId: book2.id, code: 'COPY-003', condition: 'good' } });
  const copy4 = await prisma.bookCopy.create({ data: { bookId: book3.id, code: 'COPY-004', condition: 'excellent' } });

  const loan = await prisma.loan.create({
    data: {
      bookCopyId: copy1.id,
      memberId: member.id,
      librarianId: librarian.id,
      dueDate: new Date(Date.now() + 14 * 86400000),
    },
  });

  await prisma.bookCopy.update({ where: { id: copy1.id }, data: { status: 'BORROWED' } });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
