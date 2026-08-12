import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { apiRateLimiter } from './middleware/rateLimit';
import { setupSwagger } from './config/swagger';
import authRoutes from './modules/auth/auth.routes';
import usersRoutes from './modules/users/users.routes';
import { clientsRoutes } from './modules/clients/clients.routes';
import { companyRoutes } from './modules/company/company.routes';
import { invoicesRoutes } from './modules/invoices/invoices.routes';
import { templatesRoutes } from './modules/templates/templates.routes';
import reportsRoutes from './modules/reports/reports.routes';
import dashboardRoutes from './modules/dashboard/dashboard.routes';
import pdfRoutes from './modules/pdf/pdf.routes';
import emailRoutes from './modules/email/email.routes';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.cors.origins, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(apiRateLimiter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

setupSwagger(app);

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/clients', clientsRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/invoices', invoicesRoutes);
app.use('/api/templates', templatesRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api/email', emailRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Route not found' } });
});

app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(env.port, () => {
    console.log(`Invoice Generator API running on http://localhost:${env.port}`);
    if (!env.isProduction) {
      console.log(`Swagger docs at http://localhost:${env.port}/api-docs`);
    }
  });
}

export default app;
