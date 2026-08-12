import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const adminPassword = await bcrypt.hash('admin123', 10);
  const doctorPassword = await bcrypt.hash('doctor123', 10);
  const receptionistPassword = await bcrypt.hash('reception123', 10);
  const patientPassword = await bcrypt.hash('patient123', 10);

  const admin = await prisma.user.create({
    data: { email: 'admin@hospital.com', password: adminPassword, name: 'Dr. Sarah Admin', role: 'ADMIN', phone: '+1234567890' },
  });

  const doctorUser = await prisma.user.create({
    data: { email: 'doctor@hospital.com', password: doctorPassword, name: 'Dr. John Smith', role: 'DOCTOR', phone: '+1234567891' },
  });

  const receptionistUser = await prisma.user.create({
    data: { email: 'reception@hospital.com', password: receptionistPassword, name: 'Jane Reception', role: 'RECEPTIONIST', phone: '+1234567892' },
  });

  const patientUser = await prisma.user.create({
    data: { email: 'patient@hospital.com', password: patientPassword, name: 'Bob Patient', role: 'PATIENT', phone: '+1234567893' },
  });

  const cardiology = await prisma.department.create({
    data: { name: 'Cardiology', description: 'Heart and cardiovascular system', phone: '+1234567801', location: 'Building A, Floor 3' },
  });

  const neurology = await prisma.department.create({
    data: { name: 'Neurology', description: 'Nervous system disorders', phone: '+1234567802', location: 'Building B, Floor 2' },
  });

  const doctor = await prisma.doctor.create({
    data: {
      userId: doctorUser.id,
      departmentId: cardiology.id,
      specialization: 'Cardiologist',
      bio: 'Experienced cardiologist with 15 years of practice',
      consultationFee: 250,
      isActive: true,
    },
  });

  await prisma.department.update({
    where: { id: cardiology.id },
    data: { headDoctorId: doctor.id },
  });

  const patient = await prisma.patient.create({
    data: {
      userId: patientUser.id,
      dateOfBirth: new Date('1985-06-15'),
      gender: 'MALE',
      address: '123 Main St, City',
      bloodType: 'O_POSITIVE',
      allergies: 'Penicillin',
      chronicConditions: 'Hypertension',
      insuranceNumber: 'INS-123456',
      emergencyContact: '+1234567894',
      primaryDoctorId: doctor.id,
    },
  });

  for (let day = 1; day <= 5; day++) {
    await prisma.workingHours.create({
      data: { doctorId: doctor.id, dayOfWeek: day, startTime: '09:00', endTime: '17:00', isBreak: false },
    });
    await prisma.workingHours.create({
      data: { doctorId: doctor.id, dayOfWeek: day, startTime: '12:00', endTime: '13:00', isBreak: true },
    });
  }

  await prisma.doctorService.create({
    data: { doctorId: doctor.id, name: 'General Consultation', description: 'Standard cardiology consultation', duration: 30, price: 250 },
  });

  await prisma.doctorService.create({
    data: { doctorId: doctor.id, name: 'ECG Test', description: 'Electrocardiogram test', duration: 45, price: 350 },
  });

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);

  const appointmentEnd = new Date(tomorrow);
  appointmentEnd.setHours(10, 30, 0, 0);

  const appointment = await prisma.appointment.create({
    data: {
      doctorId: doctor.id,
      patientId: patient.id,
      startTime: tomorrow,
      endTime: appointmentEnd,
      status: 'SCHEDULED',
      reason: 'Regular checkup',
    },
  });

  await prisma.notification.create({
    data: { userId: patientUser.id, type: 'APPOINTMENT_CONFIRMED', title: 'Appointment Confirmed', message: `Your appointment with Dr. John Smith on ${tomorrow.toDateString()} has been confirmed.`, appointmentId: appointment.id },
  });

  await prisma.notification.create({
    data: { userId: doctorUser.id, type: 'APPOINTMENT_REMINDER', title: 'Upcoming Appointment', message: `You have an appointment with Bob Patient tomorrow at 10:00 AM.`, appointmentId: appointment.id },
  });

  console.log('Seed completed successfully!');
  console.log('Demo accounts:');
  console.log('  Admin: admin@hospital.com / admin123');
  console.log('  Doctor: doctor@hospital.com / doctor123');
  console.log('  Receptionist: reception@hospital.com / reception123');
  console.log('  Patient: patient@hospital.com / patient123');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
