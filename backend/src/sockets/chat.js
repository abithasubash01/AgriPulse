/**
 * Chat Socket.IO handlers.
 * Real-time messaging between farmers and buyers.
 */

const { prisma } = require('../config/database');
const logger = require('../utils/logger');

function registerChatHandlers(io, socket) {
  const userId = socket.user.id; // set by middleware

  /**
   * User joins a chat room.
   * Room ID is usually an alphabetized concatenation of the two user IDs (e.g., buyerId_farmerId)
   */
  socket.on('joinRoom', async (roomId) => {
    socket.join(roomId);
    logger.debug(`User ${userId} joined room ${roomId}`);

    // Optionally load message history and emit back to user
    try {
      const messages = await prisma.message.findMany({
        where: { roomId },
        orderBy: { createdAt: 'asc' },
        take: 50,
      });
      socket.emit('messageHistory', messages);
    } catch (err) {
      logger.error(`Error loading chat history for room ${roomId}: ${err.message}`);
    }
  });

  /**
   * User sends a message.
   */
  socket.on('sendMessage', async (data) => {
    const { roomId, receiverId, content } = data;

    try {
      const message = await prisma.message.create({
        data: {
          roomId,
          senderId: userId,
          receiverId,
          content,
        },
        include: { sender: { select: { id: true, name: true } } },
      });

      // Emit to room
      io.to(roomId).emit('receiveMessage', message);
      logger.debug(`Message sent in room ${roomId} by ${userId}`);
    } catch (err) {
      logger.error(`Error sending message: ${err.message}`);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  /**
   * Mark messages as read.
   */
  socket.on('markAsRead', async (roomId) => {
    try {
      await prisma.message.updateMany({
        where: { roomId, receiverId: userId, isRead: false },
        data: { isRead: true },
      });
      // Notify sender that messages were read
      socket.to(roomId).emit('messagesRead', { roomId, readerId: userId });
    } catch (err) {
      logger.error(`Error marking messages as read: ${err.message}`);
    }
  });

  socket.on('disconnect', () => {
    logger.debug(`User ${userId} disconnected from chat`);
  });
}

module.exports = { registerChatHandlers };
