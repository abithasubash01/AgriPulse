/**
 * Express-validator schemas for authentication endpoints.
 */

const { body } = require('express-validator');
const { ROLE_VALUES } = require('../constants');

const registerValidation = [
  body('phone')
    .notEmpty().withMessage('Phone number is required')
    .matches(/^\+?[1-9]\d{6,14}$/).withMessage('Invalid phone number format'),
  body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters'),
  body('role')
    .optional()
    .isIn(ROLE_VALUES).withMessage(`Role must be one of: ${ROLE_VALUES.join(', ')}`),
  body('firebaseIdToken')
    .notEmpty().withMessage('Firebase ID token is required'),
];

const loginValidation = [
  body('firebaseIdToken')
    .notEmpty().withMessage('Firebase ID token is required'),
];

const updateProfileValidation = [
  body('name')
    .optional()
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters'),
  body('email')
    .optional()
    .isEmail().withMessage('Invalid email format'),
  body('district')
    .optional()
    .isLength({ min: 2, max: 100 }).withMessage('District must be 2–100 characters'),
  body('state')
    .optional()
    .isLength({ min: 2, max: 100 }).withMessage('State must be 2–100 characters'),
];

const changePasswordValidation = [
  body('currentPassword')
    .notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/\d/).withMessage('Password must contain at least one number'),
  body('confirmPassword')
    .notEmpty().withMessage('Confirm password is required')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
];

const refreshTokenValidation = [
  body('refreshToken')
    .optional()
    .isString().withMessage('Refresh token must be a string'),
];

module.exports = {
  registerValidation,
  loginValidation,
  updateProfileValidation,
  changePasswordValidation,
  refreshTokenValidation,
};
