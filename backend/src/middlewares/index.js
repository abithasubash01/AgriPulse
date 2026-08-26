/**
 * Middleware barrel export.
 */

const { authenticate, optionalAuth } = require('./auth');
const { authorize } = require('./role');
const { validate } = require('./validation');
const { errorHandler, notFoundHandler } = require('./errorHandler');
const { globalLimiter, authLimiter, createLimiter } = require('./rateLimiter');
const { uploadSingle, uploadMultiple, handleMulterError } = require('./upload');

module.exports = {
  authenticate,
  optionalAuth,
  authorize,
  validate,
  errorHandler,
  notFoundHandler,
  globalLimiter,
  authLimiter,
  createLimiter,
  uploadSingle,
  uploadMultiple,
  handleMulterError,
};
