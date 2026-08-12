import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { apiRateLimiter } from './middleware/rateLimit';
import { swaggerSpec } from './config/swagger';
import swaggerUi from 'swagger-ui-express';
import { isProduction } from './config/env';

import authRoutes from './modules/auth/auth.routes';
import usersRoutes from './modules/users/users.routes';
import productsRoutes from './modules/products/products.routes';
import categoriesRoutes from './modules/categories/categories.routes';
import warehousesRoutes from './modules/warehouses/warehouses.routes';
import stockMovementsRoutes from './modules/stock-movements/stock-movements.routes';
import suppliersRoutes from './modules/suppliers/suppliers.routes';
import purchaseOrdersRoutes from './modules/purchase-orders/purchase-orders.routes';
import dashboardRoutes from './modules/dashboard/dashboard.routes';
import exportRoutes from './modules/export/export.routes';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.cors.origins, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(apiRateLimiter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

if (!isProduction) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/warehouses', warehousesRoutes);
app.use('/api/stock-movements', stockMovementsRoutes);
app.use('/api/suppliers', suppliersRoutes);
app.use('/api/purchase-orders', purchaseOrdersRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/export', exportRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Route not found' } });
});

app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(env.port, () => {
    console.log(`Inventory Management API running on port ${env.port}`);
  });
}

export default app;
