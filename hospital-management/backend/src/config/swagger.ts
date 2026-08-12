import swaggerJsdoc from 'swagger-jsdoc';
import { env } from './env';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MediCare API',
      version: '1.0.0',
      description: 'Hospital Management System API',
    },
    servers: [
      { url: `http://localhost:${env.PORT}/api`, description: 'Local server' },
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
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/modules/*/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
