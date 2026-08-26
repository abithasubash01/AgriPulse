/**
 * Cloudinary configuration and upload helper.
 */

const cloudinary = require('cloudinary').v2;
const env = require('./env');
const logger = require('../utils/logger');

let isConfigured = false;

function initializeCloudinary() {
  if (env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET) {
    cloudinary.config({
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
      secure: true,
    });
    isConfigured = true;
    logger.info('✅ Cloudinary configured');
  } else {
    logger.warn('⚠️  Cloudinary credentials not provided. Image uploads will be skipped.');
  }
}

/**
 * Upload a file buffer to Cloudinary.
 * @param {Buffer} fileBuffer
 * @param {object} options – { folder, publicId, resourceType }
 * @returns {Promise<object>} upload result with url, publicId, etc.
 */
async function uploadToCloudinary(fileBuffer, options = {}) {
  if (!isConfigured) {
    logger.warn('Cloudinary not configured – returning placeholder URL');
    return {
      url: 'https://via.placeholder.com/400x300?text=No+Image',
      publicId: `placeholder_${Date.now()}`,
      secure_url: 'https://via.placeholder.com/400x300?text=No+Image',
    };
  }

  const folder = options.folder || env.CLOUDINARY_FOLDER;

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: options.publicId,
        resource_type: options.resourceType || 'image',
        transformation: [
          { width: 1200, crop: 'limit' },
          { quality: 'auto:good' },
          { fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error) {
          logger.error(`Cloudinary upload error: ${error.message}`);
          return reject(error);
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
        });
      }
    );

    uploadStream.end(fileBuffer);
  });
}

/**
 * Delete an image from Cloudinary by public ID.
 * @param {string} publicId
 */
async function deleteFromCloudinary(publicId) {
  if (!isConfigured) return;
  try {
    await cloudinary.uploader.destroy(publicId);
    logger.debug(`Cloudinary: deleted ${publicId}`);
  } catch (error) {
    logger.error(`Cloudinary delete error: ${error.message}`);
  }
}

module.exports = {
  initializeCloudinary,
  uploadToCloudinary,
  deleteFromCloudinary,
  cloudinary,
};
