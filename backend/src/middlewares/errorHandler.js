/**
 * Centralized error handling middleware.
 * Catches all errors thrown from routes/controllers and returns a consistent JSON response.
 */

const logger = require('../utils/logger');
const { STATUS_CODES } = require('../constants');

/**
 * Global error handler – must be the LAST middleware registered.
 */
function errorHandler(err, req, res, _next) {
  // Log the error
  logger.error(`${err.name || 'Error'}: ${err.message}`, {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    stack: err.stack,
  });

  // Determine status code
  const statusCode = err.statusCode || err.status || STATUS_CODES.INTERNAL_ERROR;

  // Build response
  const response = {
    success: false,
    message: err.isOperational ? err.message : 'Internal server error',
  };

  // Attach validation errors if present
  if (err.errors) {
    response.errors = err.errors;
  }

  // In development, include stack trace
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  return res.status(statusCode).json(response);
}

/**
 * Catch-all for 404 routes.
 */
function notFoundHandler(req, res, _next) {
  return res.status(STATUS_CODES.NOT_FOUND).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
}

module.exports = { errorHandler, notFoundHandler };
