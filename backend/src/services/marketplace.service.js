/**
 * Marketplace service – business logic for reviews and transactions.
 */

const { prisma } = require('../config/database');
const { parsePagination, buildPaginationMeta } = require('../helpers/pagination');
const { NotFoundError, BadRequestError } = require('../utils/errors');
const { MESSAGES } = require('../constants');
const logger = require('../utils/logger');

class MarketplaceService {
  /**
   * Add a rating/review to a listing.
   * @param {string} reviewerId
   * @param {object} data - { listingId, rating, comment }
   */
  async addReview(reviewerId, { listingId, rating, comment }) {
    const listing = await prisma.cropListing.findUnique({ where: { id: listingId } });
    if (!listing) throw new NotFoundError(MESSAGES.CROP_NOT_FOUND);

    // Prevent farmer from reviewing their own listing
    if (listing.farmerId === reviewerId) {
      throw new BadRequestError('You cannot review your own listing.');
    }

    const review = await prisma.review.create({
      data: {
        reviewerId,
        listingId,
        rating: parseInt(rating, 10),
        comment,
      },
    });

    logger.debug(`Review added: listing ${listingId} by user ${reviewerId}`);
    return review;
  }

  /**
   * Get transaction history for a user (as buyer or farmer).
   * @param {string} userId
   * @param {object} queryParams
   */
  async getTransactionHistory(userId, queryParams) {
    const { page, limit, skip } = parsePagination(queryParams);
    const { role, status } = queryParams;

    const where = {};
    if (role === 'farmer') {
      where.farmerId = userId;
    } else if (role === 'buyer') {
      where.buyerId = userId;
    } else {
      // Default: get both
      where.OR = [{ buyerId: userId }, { farmerId: userId }];
    }

    if (status) {
      where.status = status;
    }

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.transaction.count({ where }),
    ]);

    const pagination = buildPaginationMeta(total, page, limit);
    return { transactions, pagination };
  }

  /**
   * Update transaction status (e.g., pending -> completed)
   * @param {string} transactionId
   * @param {string} userId - farmer or buyer making the update
   * @param {string} status - new status
   */
  async updateTransactionStatus(transactionId, userId, status) {
    const transaction = await prisma.transaction.findUnique({ where: { id: transactionId } });
    if (!transaction) throw new NotFoundError(MESSAGES.NOT_FOUND);

    if (transaction.buyerId !== userId && transaction.farmerId !== userId) {
      throw new BadRequestError('Unauthorized to update this transaction.');
    }

    const updated = await prisma.transaction.update({
      where: { id: transactionId },
      data: { status },
    });

    // If completed, potentially reduce listing quantity
    if (status === 'completed' && transaction.status !== 'completed') {
      await prisma.cropListing.update({
        where: { id: transaction.listingId },
        data: {
          quantity: { decrement: transaction.quantity },
        },
      });
    }

    logger.info(`Transaction ${transactionId} status updated to ${status}`);
    return updated;
  }
}

module.exports = new MarketplaceService();
