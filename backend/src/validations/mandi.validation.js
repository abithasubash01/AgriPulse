/**
 * Express-validator schemas for Mandi API.
 */

const { query } = require('express-validator');

const mandiQueryValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('state').optional().isString().trim(),
  query('district').optional().isString().trim(),
  query('commodity').optional().isString().trim(),
  query('market').optional().isString().trim(),
  query('search').optional().isString().trim(),
];

const nearbyMandiValidation = [
  query('latitude').notEmpty().isFloat({ min: -90, max: 90 }).withMessage('Valid latitude required'),
  query('longitude').notEmpty().isFloat({ min: -180, max: 180 }).withMessage('Valid longitude required'),
  query('radius').optional().isFloat({ min: 1, max: 500 }).withMessage('Radius must be between 1 and 500 km'),
  query('commodity').optional().isString().trim(),
];

const recommendationValidation = [
  query('latitude').notEmpty().isFloat(),
  query('longitude').notEmpty().isFloat(),
  query('commodity').notEmpty().isString(),
  query('quantity').optional().isFloat({ min: 0.01 }),
];

module.exports = {
  mandiQueryValidation,
  nearbyMandiValidation,
  recommendationValidation,
};
