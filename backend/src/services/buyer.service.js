/**
 * Buyer service – business logic for browsing, bookmarking, enquiries, and purchases.
 */

const { prisma } = require('../config/database');
const { parsePagination, buildPaginationMeta } = require('../helpers/pagination');
const { NotFoundError, ConflictError, BadRequestError } = require('../utils/errors');
const { MESSAGES } = require('../constants');
const logger = require('../utils/logger');

class BuyerService {
  /**
   * Browse and filter available crop listings.
   * @param {object} queryParams – page, limit, search, commodity, state, district, minPrice, maxPrice, qualityGrade
   */
  async browseListings(queryParams) {
    const { page, limit, skip } = parsePagination(queryParams);
    const where = { availabilityStatus: 'available' };

    if (queryParams.search) {
      where.OR = [
        { cropName: { contains: queryParams.search, mode: 'insensitive' } },
        { commodity: { contains: queryParams.search, mode: 'insensitive' } },
        { variety: { contains: queryParams.search, mode: 'insensitive' } },
      ];
    }
    if (queryParams.commodity) {
      where.commodity = { contains: queryParams.commodity, mode: 'insensitive' };
    }
    if (queryParams.state) {
      where.state = { equals: queryParams.state, mode: 'insensitive' };
    }
    if (queryParams.district) {
      where.district = { equals: queryParams.district, mode: 'insensitive' };
    }
    if (queryParams.qualityGrade) {
      where.qualityGrade = queryParams.qualityGrade;
    }
    
    // Price filtering
    if (queryParams.minPrice || queryParams.maxPrice) {
      where.expectedPrice = {};
      if (queryParams.minPrice) where.expectedPrice.gte = parseFloat(queryParams.minPrice);
      if (queryParams.maxPrice) where.expectedPrice.lte = parseFloat(queryParams.maxPrice);
    }

    const [listings, total] = await Promise.all([
      prisma.cropListing.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { farmer: { select: { id: true, name: true, phone: true, state: true, district: true } } },
      }),
      prisma.cropListing.count({ where }),
    ]);

    const pagination = buildPaginationMeta(total, page, limit);
    return { listings, pagination };
  }

  /**
   * Bookmark a crop listing for a buyer.
   * @param {string} buyerId
   * @param {string} listingId
   */
  async addBookmark(buyerId, listingId) {
    const listing = await prisma.cropListing.findUnique({ where: { id: listingId } });
    if (!listing) throw new NotFoundError(MESSAGES.CROP_NOT_FOUND);

    const existing = await prisma.bookmark.findUnique({
      where: { userId_listingId: { userId: buyerId, listingId } },
    });

    if (existing) throw new ConflictError(MESSAGES.BOOKMARK_EXISTS);

    const bookmark = await prisma.bookmark.create({
      data: { userId: buyerId, listingId },
    });

    logger.debug(`Bookmark added: buyer ${buyerId}, listing ${listingId}`);
    return bookmark;
  }

  /**
   * Remove a bookmark.
   * @param {string} buyerId
   * @param {string} listingId
   */
  async removeBookmark(buyerId, listingId) {
    const existing = await prisma.bookmark.findUnique({
      where: { userId_listingId: { userId: buyerId, listingId } },
    });

    if (!existing) throw new NotFoundError(MESSAGES.NOT_FOUND);

    await prisma.bookmark.delete({
      where: { userId_listingId: { userId: buyerId, listingId } },
    });
    
    logger.debug(`Bookmark removed: buyer ${buyerId}, listing ${listingId}`);
  }

  /**
   * Get all bookmarks for a buyer.
   * @param {string} buyerId
   * @param {object} queryParams
   */
  async getBookmarks(buyerId, queryParams) {
    const { page, limit, skip } = parsePagination(queryParams);

    const where = { userId: buyerId };

    const [bookmarks, total] = await Promise.all([
      prisma.bookmark.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          listing: {
            include: { farmer: { select: { name: true, state: true } } }
          }
        },
      }),
      prisma.bookmark.count({ where }),
    ]);

    const pagination = buildPaginationMeta(total, page, limit);
    return { bookmarks, pagination };
  }

  /**
   * Send an enquiry to a farmer about a listing.
   * @param {string} buyerId
   * @param {object} data - { listingId, message }
   */
  async createEnquiry(buyerId, { listingId, message }) {
    const listing = await prisma.cropListing.findUnique({ where: { id: listingId } });
    if (!listing) throw new NotFoundError(MESSAGES.CROP_NOT_FOUND);

    const enquiry = await prisma.enquiry.create({
      data: {
        buyerId,
        listingId,
        message,
        status: 'pending',
      },
      include: {
        listing: { select: { cropName: true, expectedPrice: true } },
      },
    });

    logger.info(`Enquiry sent: buyer ${buyerId}, listing ${listingId}`);
    return enquiry;
  }

  /**
   * Mark a purchase intent/transaction placeholder.
   * @param {string} buyerId
   * @param {object} data - { listingId, quantity }
   */
  async purchase(buyerId, { listingId, quantity }) {
    const listing = await prisma.cropListing.findUnique({ where: { id: listingId } });
    if (!listing) throw new NotFoundError(MESSAGES.CROP_NOT_FOUND);

    if (listing.availabilityStatus !== 'available' || listing.quantity < quantity) {
      throw new BadRequestError('Requested quantity is not available.');
    }

    const transaction = await prisma.transaction.create({
      data: {
        buyerId,
        farmerId: listing.farmerId,
        listingId,
        quantity: parseFloat(quantity),
        totalPrice: parseFloat(quantity) * listing.expectedPrice,
        status: 'pending',
      },
    });

    // Optionally update listing quantity, depending on business rules
    // For now, we leave it pending until farmer approves.

    logger.info(`Purchase initiated: ${transaction.id}`);
    return transaction;
  }
}

module.exports = new BuyerService();
