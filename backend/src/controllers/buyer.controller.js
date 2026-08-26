/**
 * Buyer controller – handles HTTP requests for buyer operations.
 */

const buyerService = require('../services/buyer.service');
const { successResponse } = require('../utils/response');
const { MESSAGES, STATUS_CODES } = require('../constants');

class BuyerController {
  /**
   * GET /api/buyer/listings
   */
  async browseListings(req, res, next) {
    try {
      const { listings, pagination } = await buyerService.browseListings(req.query);

      return successResponse(res, {
        message: MESSAGES.SUCCESS,
        data: listings,
        pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/buyer/bookmarks/:id
   */
  async addBookmark(req, res, next) {
    try {
      const buyerId = req.user.id;
      const listingId = req.params.id;

      await buyerService.addBookmark(buyerId, listingId);

      return successResponse(res, {
        message: MESSAGES.BOOKMARK_ADDED,
        statusCode: STATUS_CODES.CREATED,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/buyer/bookmarks/:id
   */
  async removeBookmark(req, res, next) {
    try {
      const buyerId = req.user.id;
      const listingId = req.params.id;

      await buyerService.removeBookmark(buyerId, listingId);

      return successResponse(res, {
        message: MESSAGES.BOOKMARK_REMOVED,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/buyer/bookmarks
   */
  async getBookmarks(req, res, next) {
    try {
      const buyerId = req.user.id;
      const { bookmarks, pagination } = await buyerService.getBookmarks(buyerId, req.query);

      return successResponse(res, {
        message: MESSAGES.SUCCESS,
        data: bookmarks,
        pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/buyer/enquiries
   */
  async createEnquiry(req, res, next) {
    try {
      const buyerId = req.user.id;
      const enquiry = await buyerService.createEnquiry(buyerId, req.body);

      return successResponse(res, {
        message: MESSAGES.ENQUIRY_SENT,
        data: enquiry,
        statusCode: STATUS_CODES.CREATED,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/buyer/purchases
   */
  async purchase(req, res, next) {
    try {
      const buyerId = req.user.id;
      const transaction = await buyerService.purchase(buyerId, req.body);

      return successResponse(res, {
        message: MESSAGES.PURCHASE_MARKED,
        data: transaction,
        statusCode: STATUS_CODES.CREATED,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BuyerController();
