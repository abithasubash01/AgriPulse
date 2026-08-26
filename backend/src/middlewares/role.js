/**
 * Role-based authorization middleware.
 * Use after authenticate middleware.
 */

const { ForbiddenError } = require('../utils/errors');
const { MESSAGES } = require('../constants');

/**
 * Returns a middleware that checks if the authenticated user has one of the allowed roles.
 * @param  {...string} allowedRoles – e.g. 'farmer', 'buyer', 'admin'
 */
function authorize(...allowedRoles) {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new ForbiddenError(MESSAGES.AUTH_UNAUTHORIZED));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ForbiddenError(MESSAGES.FORBIDDEN));
    }

    next();
  };
}

module.exports = { authorize };
