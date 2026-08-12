import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { env, isProduction } from './config/env';
import { apiRateLimiter } from './middleware/rateLimit';
import { errorHandler } from './middleware/errorHandler';
import { NotFoundError } from './shared/errors';
import authRoutes from './modules/auth/auth.routes';
import usersRoutes from './modules/users/users.routes';
import linksRoutes from './modules/links/links.routes';
import redirectRoutes from './modules/redirect/redirect.routes';
import qrRoutes from './modules/qr/qr.routes';
import analyticsRoutes from './modules/analytics/analytics.routes';
import apiKeysRoutes from './modules/api-keys/api-keys.routes';
import dashboardRoutes from './modules/dashboard/dashboard.routes';
import settingsRoutes from './modules/settings/settings.routes';

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

if (!isProduction) {
  const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'URL Shortener API',
        version: '1.0.0',
        description: 'URL Shortener with analytics, QR codes, and REST API',
      },
      servers: [
        {
          url: `http://localhost:${env.port}`,
          description: 'Development server',
        },
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
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/links', linksRoutes);
app.use('/api/qr', qrRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/api-keys', apiKeysRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/settings', settingsRoutes);

app.use('/api', (_req, _res, next) => {
  next(new NotFoundError('Route'));
});

app.use('/:code', redirectRoutes);

app.use((_req, _res, next) => {
  next(new NotFoundError('Route'));
});

app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(env.port, () => {
    console.log(`Server running on http://localhost:${env.port}`);
    if (!isProduction) {
      console.log(`Swagger docs: http://localhost:${env.port}/api-docs`);
    }
  });
}

export default app;
