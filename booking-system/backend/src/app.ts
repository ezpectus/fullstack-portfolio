import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env';
import { swaggerSpec } from './config/swagger';
import { apiRateLimiter } from './middleware/rateLimit';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './modules/auth/auth.routes';
import usersRoutes from './modules/users/users.routes';
import servicesRoutes from './modules/services/services.routes';
import providersRoutes from './modules/providers/providers.routes';
import scheduleRoutes from './modules/schedule/schedule.routes';
import bookingsRoutes from './modules/bookings/bookings.routes';
import customersRoutes from './modules/customers/customers.routes';
import notificationsRoutes from './modules/notifications/notifications.routes';
import settingsRoutes from './modules/settings/settings.routes';
import dashboardRoutes from './modules/dashboard/dashboard.routes';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.cors.origins, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(apiRateLimiter);

if (env.nodeEnv !== 'production') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api', apiRateLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/providers', providersRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((_req, res) => {
  res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Route not found' } });
});

app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(env.port, () => {
    console.log(`Server running on http://localhost:${env.port}`);
    console.log(`Swagger docs at http://localhost:${env.port}/api-docs`);
  });
}

export default app;
