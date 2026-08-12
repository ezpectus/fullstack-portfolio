import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env';
import { swaggerSpec } from './config/swagger';
import { errorHandler } from './middleware/errorHandler';
import { apiRateLimiter } from './middleware/rateLimit';
import { authenticate } from './middleware/auth';
import { NotFoundError } from './shared/errors';
import authRoutes from './modules/auth/auth.routes';
import usersRoutes from './modules/users/users.routes';
import categoriesRoutes from './modules/categories/categories.routes';
import productsRoutes from './modules/products/products.routes';
import ordersRoutes from './modules/orders/orders.routes';
import customersRoutes from './modules/customers/customers.routes';
import promoCodesRoutes from './modules/promo-codes/promo-codes.routes';
import analyticsRoutes from './modules/analytics/analytics.routes';
import settingsRoutes from './modules/settings/settings.routes';
import dashboardRoutes from './modules/dashboard/dashboard.routes';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.cors.origins, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(apiRateLimiter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/uploads', authenticate, express.static(env.upload.dir));

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/promo-codes', promoCodesRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((_req, _res, next) => {
  next(new NotFoundError('Route'));
});

app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(env.port, () => {
    console.log(`Server running on http://localhost:${env.port}`);
    console.log(`Swagger docs at http://localhost:${env.port}/api-docs`);
  });
}

export default app;
