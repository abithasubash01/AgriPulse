/**
 * Express application composition.
 * Initializes middlewares, routes, and error handlers.
 */

require('express-async-errors'); // patches express to catch unhandled promise rejections
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');

const env = require('./config/env');
const logger = require('./utils/logger');
const apiRoutes = require('./routes');
const { swaggerSpec } = require('./config');
const { errorHandler, notFoundHandler, globalLimiter } = require('./middlewares');

const app = express();

// ─── Security & Utility Middlewares ─────────
app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── Logging & Rate Limiting ────────────────
app.use(morgan('combined', { stream: logger.stream }));
app.use(globalLimiter);

// ─── Swagger Documentation ──────────────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'AgriPulse API Docs',
}));

// ─── API Routes ─────────────────────────────
app.use('/api', apiRoutes);

// ─── Error Handling ─────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
