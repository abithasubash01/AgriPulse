/**
 * Express-validator schemas for farmer crop listing endpoints.
 */

const { body, param, query } = require('express-validator');

const createCropValidation = [
  body('cropName')
    .notEmpty().withMessage('Crop name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Crop name must be 2–100 characters'),
  body('commodity')
    .notEmpty().withMessage('Commodity is required')
    .isLength({ min: 2, max: 100 }).withMessage('Commodity must be 2–100 characters'),
  body('variety')
    .optional()
    .isLength({ max: 100 }).withMessage('Variety must be under 100 characters'),
  body('quantity')
    .notEmpty().withMessage('Quantity is required')
    .isFloat({ min: 0.01 }).withMessage('Quantity must be a positive number'),
  body('unit')
    .optional()
    .isIn(['quintal', 'kg', 'ton', 'bag']).withMessage('Unit must be quintal, kg, ton, or bag'),
  body('qualityGrade')
    .optional()
    .isIn(['A', 'B', 'C', 'Premium', 'Standard']).withMessage('Invalid quality grade'),
  body('expectedPrice')
    .notEmpty().withMessage('Expected price is required')
    .isFloat({ min: 0 }).withMessage('Expected price must be a non-negative number'),
  body('description')
    .optional()
    .isLength({ max: 2000 }).withMessage('Description must be under 2000 characters'),
  body('farmLatitude')
    .optional()
    .isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
  body('farmLongitude')
    .optional()
    .isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude'),
  body('district')
    .optional()
    .isLength({ max: 100 }).withMessage('District must be under 100 characters'),
  body('state')
    .optional()
    .isLength({ max: 100 }).withMessage('State must be under 100 characters'),
];

const updateCropValidation = [
  param('id').isUUID().withMessage('Invalid listing ID'),
  body('cropName')
    .optional()
    .isLength({ min: 2, max: 100 }).withMessage('Crop name must be 2–100 characters'),
  body('commodity')
    .optional()
    .isLength({ min: 2, max: 100 }).withMessage('Commodity must be 2–100 characters'),
  body('quantity')
    .optional()
    .isFloat({ min: 0.01 }).withMessage('Quantity must be a positive number'),
  body('expectedPrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('Expected price must be a non-negative number'),
  body('availabilityStatus')
    .optional()
    .isIn(['available', 'sold', 'reserved', 'expired']).withMessage('Invalid status'),
];

const cropIdValidation = [
  param('id').isUUID().withMessage('Invalid listing ID'),
];

module.exports = {
  createCropValidation,
  updateCropValidation,
  cropIdValidation,
};
