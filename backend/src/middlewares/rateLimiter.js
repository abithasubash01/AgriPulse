/**
 * Rate limiting middleware using express-rate-limit.
 */

const rateLimit = require('express-rate-limit');
const env = require('../config/env');
const { MESSAGES, STATUS_CODES } = require('../constants');

/**
 * Global rate limiter applied to all routes.
 */
const globalLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: MESSAGES.TOO_MANY_REQUESTS,
  },
  statusCode: STATUS_CODES.TOO_MANY_REQUESTS,
});

/**
 * Stricter limiter for authentication endpoints.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 attempts per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again later.',
  },
  statusCode: STATUS_CODES.TOO_MANY_REQUESTS,
});

/**
 * Create a custom rate limiter.
 * @param {number} windowMs
 * @param {number} max
 * @param {string} [message]
 */
function createLimiter(windowMs, max, message) {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: message || MESSAGES.TOO_MANY_REQUESTS,
    },
    statusCode: STATUS_CODES.TOO_MANY_REQUESTS,
  });
}

module.exports = { globalLimiter, authLimiter, createLimiter };
