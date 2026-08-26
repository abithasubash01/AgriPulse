/**
 * Configuration barrel export.
 * Single entry point for all configuration modules.
 */

const env = require('./env');
const { prisma, connectDatabase, disconnectDatabase } = require('./database');
const { initializeFirebase, verifyFirebaseToken, getOrCreateFirebaseUser } = require('./firebase');
const { initializeCloudinary, uploadToCloudinary, deleteFromCloudinary } = require('./cloudinary');
const swaggerSpec = require('./swagger');

module.exports = {
  env,
  prisma,
  connectDatabase,
  disconnectDatabase,
  initializeFirebase,
  verifyFirebaseToken,
  getOrCreateFirebaseUser,
  initializeCloudinary,
  uploadToCloudinary,
  deleteFromCloudinary,
  swaggerSpec,
};
