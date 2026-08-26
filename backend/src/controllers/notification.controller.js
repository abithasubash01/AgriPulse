/**
 * Notification controller.
 */

const notificationService = require('../services/notification.service');
const { successResponse } = require('../utils/response');
const { MESSAGES, STATUS_CODES } = require('../constants');

class NotificationController {
  /**
   * POST /api/notifications/alerts
   */
  async createAlert(req, res, next) {
    try {
      const userId = req.user.id;
      const alert = await notificationService.createAlert(userId, req.body);

      return successResponse(res, {
        message: MESSAGES.ALERT_CREATED,
        data: alert,
        statusCode: STATUS_CODES.CREATED,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/notifications/alerts
   */
  async getAlerts(req, res, next) {
    try {
      const userId = req.user.id;
      const alerts = await notificationService.getMyAlerts(userId);

      return successResponse(res, {
        message: MESSAGES.SUCCESS,
        data: alerts,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/notifications/alerts/:id
   */
  async deleteAlert(req, res, next) {
    try {
      const userId = req.user.id;
      const alertId = req.params.id;
      
      await notificationService.deleteAlert(userId, alertId);

      return successResponse(res, {
        message: MESSAGES.ALERT_DELETED,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new NotificationController();
