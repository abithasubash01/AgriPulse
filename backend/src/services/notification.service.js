/**
 * Notification service – managing price alerts and placeholders for dispatch.
 */

const { prisma } = require('../config/database');
const { getIo } = require('../sockets');
const { NotFoundError } = require('../utils/errors');
const { MESSAGES } = require('../constants');
const logger = require('../utils/logger');

class NotificationService {
  /**
   * Create a price alert for a user.
   * @param {string} userId
   * @param {object} data
   */
  async createAlert(userId, { commodity, targetPrice, market, state }) {
    const alert = await prisma.priceAlert.create({
      data: {
        userId,
        commodity,
        targetPrice: parseFloat(targetPrice),
        market,
        state,
      },
    });
    logger.debug(`Alert created for user ${userId}: ${commodity} @ ${targetPrice}`);
    return alert;
  }

  /**
   * Get all active alerts for a user.
   */
  async getMyAlerts(userId) {
    return prisma.priceAlert.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Delete a price alert.
   */
  async deleteAlert(userId, alertId) {
    const alert = await prisma.priceAlert.findUnique({ where: { id: alertId } });
    if (!alert || alert.userId !== userId) {
      throw new NotFoundError(MESSAGES.NOT_FOUND);
    }
    await prisma.priceAlert.delete({ where: { id: alertId } });
  }

  /**
   * Check alerts against new mandi prices. (To be called by cron after price fetch)
   */
  async checkAlerts(newPrices) {
    // This is a simplified check. In reality, you'd match specific market/state.
    const activeAlerts = await prisma.priceAlert.findMany({
      where: { isActive: true, isTriggered: false },
      include: { user: { select: { phone: true, id: true } } },
    });

    for (const alert of activeAlerts) {
      const match = newPrices.find(p => 
        p.commodity.toLowerCase() === alert.commodity.toLowerCase() &&
        p.modalPrice >= alert.targetPrice
      );

      if (match) {
        await this._triggerAlert(alert, match);
      }
    }
  }

  async _triggerAlert(alert, matchedPrice) {
    // 1. Mark alert as triggered
    await prisma.priceAlert.update({
      where: { id: alert.id },
      data: { isTriggered: true, triggeredAt: new Date(), isActive: false },
    });

    const message = `Price Alert: ${alert.commodity} has reached ₹${matchedPrice.modalPrice}/qtl in ${matchedPrice.market}.`;

    // 2. Emit via Socket.io if user is connected
    try {
      const io = getIo();
      io.to(alert.userId).emit('notification', { type: 'PRICE_ALERT', message });
    } catch (e) {
      // socket might not be initialized or user not connected
    }

    // 3. Dispatch SMS/Push (Placeholder)
    this._dispatchSMS(alert.user.phone, message);
    
    logger.info(`Alert triggered for user ${alert.userId}: ${alert.commodity}`);
  }

  _dispatchSMS(phone, message) {
    // Placeholder for Twilio / MSG91 integration
    logger.debug(`[SMS Placeholder] To: ${phone}, Message: ${message}`);
  }
}

module.exports = new NotificationService();
