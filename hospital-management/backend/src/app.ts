import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { apiRateLimiter } from './middleware/rateLimit';
import { swaggerSpec } from './config/swagger';
import swaggerUi from 'swagger-ui-express';

import authRouter from './modules/auth/auth.routes';
import usersRouter from './modules/users/users.routes';
import departmentsRouter from './modules/departments/departments.routes';
import doctorsRouter from './modules/doctors/doctors.routes';
import patientsRouter from './modules/patients/patients.routes';
import scheduleRouter from './modules/schedule/schedule.routes';
import appointmentsRouter from './modules/appointments/appointments.routes';
import medicalRecordsRouter from './modules/medical-records/medicalRecords.routes';
import notificationsRouter from './modules/notifications/notifications.routes';
import dashboardRouter from './modules/dashboard/dashboard.routes';
import reportsRouter from './modules/reports/reports.routes';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGINS, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(apiRateLimiter);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/departments', departmentsRouter);
app.use('/api/doctors', doctorsRouter);
app.use('/api/patients', patientsRouter);
app.use('/api/schedule', scheduleRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/medical-records', medicalRecordsRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/reports', reportsRouter);

app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
  });
}

export default app;
