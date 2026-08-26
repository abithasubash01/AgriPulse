/**
 * Application Entry Point.
 * Initializes external services, connects to the database,
 * starts the HTTP and Socket.IO server, and sets up cron jobs.
 */

const http = require('http');
const app = require('./app');
const env = require('./config/env');
const logger = require('./utils/logger');
const {
  connectDatabase,
  disconnectDatabase,
  initializeFirebase,
  initializeCloudinary,
} = require('./config');
const { initializeSocket } = require('./sockets');
const { initMandiCron } = require('./cron/mandiCron');

const server = http.createServer(app);

async function startServer() {
  try {
    // 1. Connect to Database
    await connectDatabase();

    // 2. Initialize External Services
    initializeFirebase();
    initializeCloudinary();

    // 3. Initialize Socket.IO
    initializeSocket(server);

    // 4. Initialize Scheduled Jobs
    initMandiCron();

    // 5. Start Server
    server.listen(env.PORT, () => {
      logger.info(`=========================================`);
      logger.info(`🚀 Server running in ${env.NODE_ENV} mode`);
      logger.info(`📡 API Listening on port ${env.PORT}`);
      logger.info(`📘 Swagger UI available at http://localhost:${env.PORT}/api-docs`);
      logger.info(`=========================================`);
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
}

startServer();

// ─── Graceful Shutdown ───────────────────────
const shutdown = async (signal) => {
  logger.info(`\n${signal} received. Shutting down gracefully...`);
  
  server.close(async () => {
    logger.info('HTTP server closed.');
    await disconnectDatabase();
    process.exit(0);
  });

  // Force close after 10 seconds
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Optional: shutdown(1)
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  // Should exit process
  process.exit(1);
});
