/**
 * Express-validator integration middleware.
 * Runs a set of validation chains and returns 422 on failure.
 */

const { validationResult } = require('express-validator');
const { STATUS_CODES } = require('../constants');

/**
 * Middleware factory that accepts an array of express-validator chains,
 * runs them, and sends a 422 response with detailed errors on failure.
 * @param {Array} validations – array of express-validator chains
 */
function validate(validations) {
  return async (req, res, next) => {
    // Run each validation chain
    for (const validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length) break; // short-circuit on first failure set
    }

    const errors = validationResult(req);

    if (errors.isEmpty()) {
      return next();
    }

    const extractedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
      value: err.value,
    }));

    return res.status(STATUS_CODES.UNPROCESSABLE).json({
      success: false,
      message: 'Validation failed',
      errors: extractedErrors,
    });
  };
}

module.exports = { validate };
