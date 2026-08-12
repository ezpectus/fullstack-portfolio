import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { apiRateLimiter } from './middleware/rateLimit';
import authRoutes from './modules/auth/auth.routes';
import usersRoutes from './modules/users/users.routes';
import customersRoutes from './modules/customers/customers.routes';
import dealsRoutes from './modules/deals/deals.routes';
import notesRoutes from './modules/notes/notes.routes';
import dashboardRoutes from './modules/dashboard/dashboard.routes';
import exportRoutes from './modules/export/export.routes';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.cors.origins,
    credentials: true,
  }),
);
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(apiRateLimiter);

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CRM System API',
      version: '1.0.0',
      description: 'Mini-CRM API for managing customers, deals, notes, and dashboard analytics',
    },
    servers: [
      { url: `http://localhost:${env.port}`, description: 'Local server' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/modules/**/*.ts'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
if (!env.isProduction) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/deals', dealsRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/export', exportRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Route not found' } });
});

app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(env.port, () => {
    console.log(`[CRM Backend] Server running on http://localhost:${env.port}`);
    if (!env.isProduction) {
      console.log(`[CRM Backend] Swagger docs at http://localhost:${env.port}/api-docs`);
    }
  });
}

export default app;
