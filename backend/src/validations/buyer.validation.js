/**
 * Express-validator schemas for buyer operations.
 */

const { body, param, query } = require('express-validator');

const browseValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search').optional().isString().trim(),
  query('commodity').optional().isString().trim(),
  query('state').optional().isString().trim(),
  query('district').optional().isString().trim(),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('minPrice must be non-negative'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('maxPrice must be non-negative'),
  query('qualityGrade').optional().isString().trim(),
];

const bookmarkValidation = [
  param('id').isUUID().withMessage('Invalid listing ID'),
];

const enquiryValidation = [
  body('listingId').isUUID().withMessage('Invalid listing ID'),
  body('message').notEmpty().withMessage('Message is required').isLength({ max: 1000 }).withMessage('Message too long'),
];

const purchaseValidation = [
  body('listingId').isUUID().withMessage('Invalid listing ID'),
  body('quantity').isFloat({ min: 0.01 }).withMessage('Quantity must be a positive number'),
];

module.exports = {
  browseValidation,
  bookmarkValidation,
  enquiryValidation,
  purchaseValidation,
};
