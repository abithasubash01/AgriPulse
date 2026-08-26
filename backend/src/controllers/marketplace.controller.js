/**
 * Marketplace controller.
 */

const marketplaceService = require('../services/marketplace.service');
const { successResponse } = require('../utils/response');
const { MESSAGES, STATUS_CODES } = require('../constants');

class MarketplaceController {
  /**
   * POST /api/marketplace/reviews
   */
  async addReview(req, res, next) {
    try {
      const reviewerId = req.user.id;
      const review = await marketplaceService.addReview(reviewerId, req.body);

      return successResponse(res, {
        message: MESSAGES.REVIEW_ADDED,
        data: review,
        statusCode: STATUS_CODES.CREATED,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/marketplace/transactions
   */
  async getTransactions(req, res, next) {
    try {
      const userId = req.user.id;
      const { transactions, pagination } = await marketplaceService.getTransactionHistory(userId, req.query);

      return successResponse(res, {
        message: MESSAGES.SUCCESS,
        data: transactions,
        pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/marketplace/transactions/:id/status
   */
  async updateTransactionStatus(req, res, next) {
    try {
      const transactionId = req.params.id;
      const userId = req.user.id;
      const { status } = req.body;

      const updated = await marketplaceService.updateTransactionStatus(transactionId, userId, status);

      return successResponse(res, {
        message: MESSAGES.SUCCESS,
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MarketplaceController();
