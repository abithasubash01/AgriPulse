/**
 * Multer file upload middleware.
 * Configures in-memory storage and file-type validation.
 * Files are uploaded to Cloudinary after Multer processing.
 */

const multer = require('multer');
const path = require('path');
const { BadRequestError } = require('../utils/errors');
const { MESSAGES } = require('../constants');

// Allowed image MIME types
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
];

// Max file size: 5 MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Use memory storage so we can stream buffer to Cloudinary
const storage = multer.memoryStorage();

/**
 * File filter to validate MIME types.
 */
function imageFileFilter(_req, file, cb) {
  if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new BadRequestError(
        `${MESSAGES.FILE_TYPE_NOT_ALLOWED}. Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}`
      ),
      false
    );
  }
}

/**
 * Upload middleware for single image.
 * @param {string} fieldName – form field name
 */
function uploadSingle(fieldName = 'image') {
  return multer({
    storage,
    fileFilter: imageFileFilter,
    limits: { fileSize: MAX_FILE_SIZE },
  }).single(fieldName);
}

/**
 * Upload middleware for multiple images.
 * @param {string} fieldName – form field name
 * @param {number} maxCount – maximum number of files
 */
function uploadMultiple(fieldName = 'images', maxCount = 5) {
  return multer({
    storage,
    fileFilter: imageFileFilter,
    limits: { fileSize: MAX_FILE_SIZE },
  }).array(fieldName, maxCount);
}

/**
 * Error handler for Multer errors (e.g. file too large).
 */
function handleMulterError(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return next(new BadRequestError(MESSAGES.FILE_TOO_LARGE));
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return next(new BadRequestError('Unexpected file field'));
    }
    return next(new BadRequestError(err.message));
  }
  next(err);
}

module.exports = { uploadSingle, uploadMultiple, handleMulterError };
