/**
 * Express-validator schemas for notification/alert operations.
 */

const { body, param, query } = require('express-validator');

const createAlertValidation = [
  body('commodity').notEmpty().isString().trim(),
  body('targetPrice').isFloat({ min: 0 }),
  body('market').optional().isString().trim(),
  body('state').optional().isString().trim(),
];

const alertIdValidation = [
  param('id').isUUID().withMessage('Invalid alert ID'),
];

module.exports = {
  createAlertValidation,
  alertIdValidation,
};
