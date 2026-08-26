/**
 * Prisma Client singleton.
 * Ensures only one instance of PrismaClient is created across the app.
 */

const { PrismaClient } = require('@prisma/client');
const logger = require('../utils/logger');

let prisma;

try {
  prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development'
      ? [
          { emit: 'event', level: 'query' },
          { emit: 'event', level: 'error' },
          { emit: 'event', level: 'warn' },
        ]
      : [{ emit: 'event', level: 'error' }],
  });

  if (process.env.NODE_ENV === 'development') {
    prisma.$on('query', (e) => {
      logger.debug(`Prisma Query: ${e.query} — Duration: ${e.duration}ms`);
    });
  }

  prisma.$on('error', (e) => {
    logger.error(`Prisma Error: ${e.message}`);
  });
} catch (error) {
  logger.warn('Prisma Client could not be initialized. Database features will be unavailable.');
  // Create a proxy that logs warnings when DB methods are called without a connection
  prisma = new Proxy({}, {
    get(_, prop) {
      if (prop === '$connect' || prop === '$disconnect') {
        return async () => {
          logger.warn(`Database not configured — ${prop} is a no-op.`);
        };
      }
      return new Proxy(() => {}, {
        get() {
          return () => {
            throw new Error('Database is not configured. Please set DATABASE_URL in .env');
          };
        },
      });
    },
  });
}

/**
 * Connect to the database.
 * Called once during server startup.
 */
async function connectDatabase() {
  try {
    await prisma.$connect();
    logger.info('✅ Database connected successfully');
  } catch (error) {
    logger.error(`❌ Database connection failed: ${error.message}`);
    logger.warn('Server will continue without database. Some features will be unavailable.');
  }
}

/**
 * Disconnect from the database.
 * Called during graceful shutdown.
 */
async function disconnectDatabase() {
  try {
    await prisma.$disconnect();
    logger.info('Database disconnected');
  } catch (error) {
    logger.error(`Error disconnecting database: ${error.message}`);
  }
}

module.exports = { prisma, connectDatabase, disconnectDatabase };
