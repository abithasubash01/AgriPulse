/**
 * Farmer controller – handles HTTP requests for crop listings.
 */

const farmerService = require('../services/farmer.service');
const { successResponse } = require('../utils/response');
const { MESSAGES, STATUS_CODES } = require('../constants');

class FarmerController {
  /**
   * POST /api/farmer/crops
   */
  async createCrop(req, res, next) {
    try {
      const farmerId = req.user.id;
      // req.files is populated by multer if multiple files uploaded
      const imageBuffers = req.files ? req.files.map((file) => file.buffer) : [];

      const listing = await farmerService.createCropListing(farmerId, req.body, imageBuffers);

      return successResponse(res, {
        message: MESSAGES.CROP_CREATED,
        data: listing,
        statusCode: STATUS_CODES.CREATED,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/farmer/crops
   */
  async getMyListings(req, res, next) {
    try {
      const farmerId = req.user.id;
      const { listings, pagination } = await farmerService.getFarmerListings(farmerId, req.query);

      return successResponse(res, {
        message: MESSAGES.CROP_LIST_FETCHED,
        data: listings,
        pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/farmer/crops/:id
   */
  async getListingById(req, res, next) {
    try {
      const listing = await farmerService.getListingById(req.params.id);

      return successResponse(res, {
        message: MESSAGES.SUCCESS,
        data: listing,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/farmer/crops/:id
   */
  async updateCrop(req, res, next) {
    try {
      const listingId = req.params.id;
      const farmerId = req.user.id;
      const imageBuffers = req.files ? req.files.map((file) => file.buffer) : [];

      const updatedListing = await farmerService.updateCropListing(listingId, farmerId, req.body, imageBuffers);

      return successResponse(res, {
        message: MESSAGES.CROP_UPDATED,
        data: updatedListing,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/farmer/crops/:id
   */
  async deleteCrop(req, res, next) {
    try {
      const listingId = req.params.id;
      const farmerId = req.user.id;

      await farmerService.deleteCropListing(listingId, farmerId);

      return successResponse(res, {
        message: MESSAGES.CROP_DELETED,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new FarmerController();
