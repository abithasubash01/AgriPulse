/**
 * Authentication middleware.
 * Verifies JWT access token from the Authorization header.
 */

const { verifyToken } = require('../helpers/jwt');
const { UnauthorizedError } = require('../utils/errors');
const { MESSAGES } = require('../constants');
const logger = require('../utils/logger');

/**
 * Middleware that extracts and verifies the Bearer token.
 * On success, attaches the decoded user payload to req.user.
 */
function authenticate(req, _res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError(MESSAGES.AUTH_TOKEN_MISSING);
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedError(MESSAGES.AUTH_TOKEN_MISSING);
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new UnauthorizedError(MESSAGES.AUTH_TOKEN_EXPIRED));
    }
    if (error.name === 'JsonWebTokenError') {
      return next(new UnauthorizedError(MESSAGES.AUTH_TOKEN_INVALID));
    }
    next(error);
  }
}

/**
 * Optional authentication – sets req.user if token is present but doesn't fail otherwise.
 */
function optionalAuth(req, _res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      if (token) {
        req.user = verifyToken(token);
      }
    }
  } catch (error) {
    logger.debug('Optional auth token invalid – proceeding as guest');
  }
  next();
}

module.exports = { authenticate, optionalAuth };
