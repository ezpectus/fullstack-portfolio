import { PrismaClient, Role, LeaveTypeName } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding HR Portal...');

  const adminPassword = await bcrypt.hash('admin123', 10);
  const managerPassword = await bcrypt.hash('manager123', 10);
  const empPassword = await bcrypt.hash('employee123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@hrportal.com' },
    update: {},
    create: { email: 'admin@hrportal.com', password: adminPassword, name: 'HR Admin', role: Role.HR_ADMIN, phone: '+1234567890' },
  });

  const manager = await prisma.user.upsert({
    where: { email: 'manager@hrportal.com' },
    update: {},
    create: { email: 'manager@hrportal.com', password: managerPassword, name: 'John Manager', role: Role.MANAGER, phone: '+1234567891' },
  });

  const employee = await prisma.user.upsert({
    where: { email: 'employee@hrportal.com' },
    update: {},
    create: { email: 'employee@hrportal.com', password: empPassword, name: 'Jane Employee', role: Role.EMPLOYEE, phone: '+1234567892' },
  });

  const itDept = await prisma.department.upsert({
    where: { id: 'dept-it-0001' },
    update: {},
    create: { id: 'dept-it-0001', name: 'IT', description: 'Information Technology' },
  });

  const hrDept = await prisma.department.upsert({
    where: { id: 'dept-hr-0001' },
    update: {},
    create: { id: 'dept-hr-0001', name: 'Human Resources', description: 'HR Department' },
  });

  const financeDept = await prisma.department.upsert({
    where: { id: 'dept-fin-001' },
    update: {},
    create: { id: 'dept-fin-001', name: 'Finance', description: 'Finance Department' },
  });

  const managerEmp = await prisma.employee.upsert({
    where: { userId: manager.id },
    update: {},
    create: {
      userId: manager.id,
      firstName: 'John',
      lastName: 'Manager',
      dateOfBirth: new Date('1985-05-15'),
      phone: '+1234567891',
      position: 'IT Manager',
      departmentId: itDept.id,
      hireDate: new Date('2020-01-15'),
      salary: 80000,
      education: 'MSc Computer Science',
      experience: '10 years',
      skills: 'Leadership, Project Management, Architecture',
    },
  });

  await prisma.department.update({ where: { id: itDept.id }, data: { managerId: managerEmp.id } });

  await prisma.employee.upsert({
    where: { userId: employee.id },
    update: {},
    create: {
      userId: employee.id,
      firstName: 'Jane',
      lastName: 'Employee',
      dateOfBirth: new Date('1990-03-20'),
      phone: '+1234567892',
      position: 'Software Developer',
      departmentId: itDept.id,
      managerId: managerEmp.id,
      hireDate: new Date('2022-06-01'),
      salary: 60000,
      education: 'BSc Computer Science',
      experience: '5 years',
      skills: 'React, Node.js, TypeScript',
    },
  });

  for (const [name, days] of [['ANNUAL', 20], ['SICK', 10], ['UNPAID', 0], ['MATERNITY', 90]] as [LeaveTypeName, number][]) {
    await prisma.leaveType.upsert({
      where: { name },
      update: {},
      create: { name, defaultDays: days },
    });
  }

  await prisma.notification.create({
    data: {
      userId: employee.id,
      type: 'WELCOME',
      title: 'Welcome to HR Portal',
      message: 'Your account has been created successfully.',
    },
  }).catch(() => {});

  console.log('Seed completed successfully!');
  console.log('Credentials:');
  console.log('  Admin: admin@hrportal.com / admin123');
  console.log('  Manager: manager@hrportal.com / manager123');
  console.log('  Employee: employee@hrportal.com / employee123');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
