import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env, isProduction } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { apiRateLimiter } from './middleware/rateLimit';
import { swaggerSpec } from './config/swagger';
import swaggerUi from 'swagger-ui-express';

import authRouter from './modules/auth/auth.routes';
import usersRouter from './modules/users/users.routes';
import departmentsRouter from './modules/departments/departments.routes';
import employeesRouter from './modules/employees/employees.routes';
import leaveRouter from './modules/leave/leave.routes';
import payrollRouter from './modules/payroll/payroll.routes';
import documentsRouter from './modules/documents/documents.routes';
import notificationsRouter from './modules/notifications/notifications.routes';
import dashboardRouter from './modules/dashboard/dashboard.routes';
import reportsRouter from './modules/reports/reports.routes';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGINS, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(apiRateLimiter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

if (!isProduction) {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/departments', departmentsRouter);
app.use('/api/employees', employeesRouter);
app.use('/api/leave', leaveRouter);
app.use('/api/payroll', payrollRouter);
app.use('/api/documents', documentsRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/reports', reportsRouter);

app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(env.PORT, () => {
    console.log(`HR Portal API running on port ${env.PORT}`);
  });
}

export default app;
