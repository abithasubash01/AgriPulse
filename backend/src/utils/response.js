/**
 * Standardized API response helpers.
 * Every controller should use these to ensure consistent JSON shape.
 */

const STATUS_CODES = require('../constants/statusCodes');

/**
 * Send a success response.
 * @param {import('express').Response} res
 * @param {object} options
 * @param {string}  options.message
 * @param {*}       [options.data]
 * @param {number}  [options.statusCode=200]
 * @param {object}  [options.pagination]
 */
function successResponse(res, { message = 'Success', data = null, statusCode = STATUS_CODES.OK, pagination = null }) {
  const response = {
    success: true,
    message,
    data,
  };

  if (pagination) {
    response.pagination = pagination;
  }

  return res.status(statusCode).json(response);
}

/**
 * Send an error response.
 * @param {import('express').Response} res
 * @param {object} options
 * @param {string}  options.message
 * @param {number}  [options.statusCode=500]
 * @param {*}       [options.error]
 */
function errorResponse(res, { message = 'Something went wrong', statusCode = STATUS_CODES.INTERNAL_ERROR, error = null }) {
  const response = {
    success: false,
    message,
  };

  if (error && process.env.NODE_ENV === 'development') {
    response.error = error;
  }

  return res.status(statusCode).json(response);
}

module.exports = { successResponse, errorResponse };
