/**
 * Socket.IO entry point and middleware configuration.
 */

const socketIo = require('socket.io');
const { verifyToken } = require('../helpers/jwt');
const logger = require('../utils/logger');
const { registerChatHandlers } = require('./chat');

let io;

function initializeSocket(server) {
  io = socketIo(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Authentication middleware
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
      
      if (!token) {
        return next(new Error('Authentication error: Token missing'));
      }

      const decoded = verifyToken(token);
      socket.user = decoded;
      next();
    } catch (err) {
      logger.warn(`Socket connection rejected: ${err.message}`);
      next(new Error('Authentication error: Invalid token'));
    }
  });

  // Global connection handler
  io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id} (User: ${socket.user.id})`);

    // Register domain-specific handlers
    registerChatHandlers(io, socket);

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
}

/**
 * Get the io instance for emitting events outside of socket handlers (e.g., from controllers/cron jobs).
 */
function getIo() {
  if (!io) {
    throw new Error('Socket.io has not been initialized');
  }
  return io;
}

module.exports = { initializeSocket, getIo };
