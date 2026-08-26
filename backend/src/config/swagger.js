/**
 * Swagger / OpenAPI configuration.
 * Generates spec from JSDoc comments across all route files.
 */

const swaggerJsdoc = require('swagger-jsdoc');
const env = require('./env');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'AgriPulse API',
    version: '1.0.0',
    description:
      'Production-ready API for the AgriPulse agricultural marketplace platform. ' +
      'Provides endpoints for authentication, crop listings, mandi prices, marketplace, ' +
      'real-time messaging, notifications, weather, government schemes, and AI services.',
    contact: {
      name: 'AgriPulse Team',
    },
    license: {
      name: 'ISC',
    },
  },
  servers: [
    {
      url: `http://localhost:${env.PORT}/api`,
      description: 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT access token',
      },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Something went wrong' },
          error: { type: 'object' },
        },
      },
      SuccessResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string' },
          data: { type: 'object' },
        },
      },
      PaginatedResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string' },
          data: { type: 'array', items: {} },
          pagination: {
            type: 'object',
            properties: {
              page: { type: 'integer', example: 1 },
              limit: { type: 'integer', example: 10 },
              total: { type: 'integer', example: 100 },
              totalPages: { type: 'integer', example: 10 },
              hasNext: { type: 'boolean', example: true },
              hasPrev: { type: 'boolean', example: false },
            },
          },
        },
      },
    },
  },
  tags: [
    { name: 'Auth', description: 'Authentication & Authorization' },
    { name: 'Farmer', description: 'Farmer crop listing management' },
    { name: 'Buyer', description: 'Buyer browsing, bookmarks, enquiries' },
    { name: 'Mandi', description: 'Live mandi prices & analytics' },
    { name: 'Marketplace', description: 'General marketplace operations' },
    { name: 'Notifications', description: 'Price alerts & notifications' },
    { name: 'Weather', description: 'Weather service (placeholder)' },
    { name: 'Schemes', description: 'Government agricultural schemes' },
    { name: 'AI', description: 'AI services (placeholder)' },
    { name: 'Chat', description: 'Real-time messaging' },
  ],
};

const options = {
  swaggerDefinition,
  apis: [
    './src/routes/*.js',
    './src/controllers/*.js',
    './src/docs/*.yaml',
  ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
