/**
 * Mandi controller – handles HTTP requests for live market prices.
 */

const mandiService = require('../services/mandi.service');
const { successResponse } = require('../utils/response');
const { MESSAGES } = require('../constants');

class MandiController {
  /**
   * GET /api/mandi/live
   */
  async getLivePrices(req, res, next) {
    try {
      const { prices, pagination, source } = await mandiService.getPrices(req.query);

      return successResponse(res, {
        message: source || MESSAGES.MANDI_PRICES_FETCHED,
        data: prices,
        pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/mandi/nearby
   */
  async getNearbyMandis(req, res, next) {
    try {
      const { latitude, longitude, radius, commodity } = req.query;
      
      const nearby = await mandiService.getNearbyMandis({
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        radius: radius ? parseFloat(radius) : 50,
        commodity,
      });

      return successResponse(res, {
        message: MESSAGES.SUCCESS,
        data: nearby,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/mandi/recommendation
   */
  async getRecommendation(req, res, next) {
    try {
      const { latitude, longitude, commodity, quantity } = req.query;
      
      const result = await mandiService.getRecommendation({
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        commodity,
        quantity: quantity ? parseFloat(quantity) : 10,
      });

      return successResponse(res, {
        message: MESSAGES.MANDI_RECOMMENDATION,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MandiController();
