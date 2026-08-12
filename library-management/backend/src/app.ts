import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { apiRateLimiter } from './middleware/rateLimit';
import { swaggerSpec } from './config/swagger';
import swaggerUi from 'swagger-ui-express';

import authRoutes from './modules/auth/auth.routes';
import usersRoutes from './modules/users/users.routes';
import booksRoutes from './modules/books/books.routes';
import bookCopiesRoutes from './modules/book-copies/book-copies.routes';
import membersRoutes from './modules/members/members.routes';
import loansRoutes from './modules/loans/loans.routes';
import reservationsRoutes from './modules/reservations/reservations.routes';
import finesRoutes from './modules/fines/fines.routes';
import dashboardRoutes from './modules/dashboard/dashboard.routes';
import reportsRoutes from './modules/reports/reports.routes';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.cors.origins, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(apiRateLimiter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

if (env.nodeEnv !== 'production') {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/books', booksRoutes);
app.use('/api/book-copies', bookCopiesRoutes);
app.use('/api/members', membersRoutes);
app.use('/api/loans', loansRoutes);
app.use('/api/reservations', reservationsRoutes);
app.use('/api/fines', finesRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportsRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Route not found' } });
});

app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(env.port, () => {
    console.log(`Library Management API running on port ${env.port}`);
  });
}

export default app;
