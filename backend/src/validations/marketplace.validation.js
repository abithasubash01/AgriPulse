/**
 * Express-validator schemas for marketplace operations (reviews, transactions).
 */

const { body, query } = require('express-validator');

const reviewValidation = [
  body('listingId').isUUID().withMessage('Invalid listing ID'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().isString().isLength({ max: 500 }).withMessage('Comment too long'),
];

const transactionQueryValidation = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('role').optional().isIn(['buyer', 'farmer']).withMessage('Role must be buyer or farmer'),
  query('status').optional().isIn(['pending', 'completed', 'cancelled']),
];

module.exports = {
  reviewValidation,
  transactionQueryValidation,
};
