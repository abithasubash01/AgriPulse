/**
 * Farmer service – business logic for crop listing management.
 */

const { prisma } = require('../config/database');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');
const { NotFoundError, ForbiddenError } = require('../utils/errors');
const { MESSAGES } = require('../constants');
const { parsePagination, buildPaginationMeta } = require('../helpers/pagination');
const logger = require('../utils/logger');

class FarmerService {
  /**
   * Create a new crop listing.
   * @param {string} farmerId
   * @param {object} data – listing fields
   * @param {Array<Buffer>} imageBuffers – uploaded file buffers
   */
  async createCropListing(farmerId, data, imageBuffers = []) {
    // Upload images to Cloudinary
    const imageUrls = [];
    for (const buffer of imageBuffers) {
      const result = await uploadToCloudinary(buffer, {
        folder: 'agripulse/crops',
      });
      imageUrls.push(result.url);
    }

    const listing = await prisma.cropListing.create({
      data: {
        farmerId,
        cropName: data.cropName,
        commodity: data.commodity,
        variety: data.variety || null,
        quantity: parseFloat(data.quantity),
        unit: data.unit || 'quintal',
        qualityGrade: data.qualityGrade || null,
        expectedPrice: parseFloat(data.expectedPrice),
        description: data.description || null,
        farmLatitude: data.farmLatitude ? parseFloat(data.farmLatitude) : null,
        farmLongitude: data.farmLongitude ? parseFloat(data.farmLongitude) : null,
        district: data.district || null,
        state: data.state || null,
        images: imageUrls,
        availabilityStatus: 'available',
      },
      include: { farmer: { select: { id: true, name: true, phone: true, district: true, state: true } } },
    });

    logger.info(`Crop listing created: ${listing.id} by farmer ${farmerId}`);
    return listing;
  }

  /**
   * Get all crop listings for a farmer with pagination.
   * @param {string} farmerId
   * @param {object} query – { page, limit, status, search }
   */
  async getFarmerListings(farmerId, query) {
    const { page, limit, skip } = parsePagination(query);

    const where = { farmerId };

    if (query.status) {
      where.availabilityStatus = query.status;
    }
    if (query.search) {
      where.OR = [
        { cropName: { contains: query.search, mode: 'insensitive' } },
        { commodity: { contains: query.search, mode: 'insensitive' } },
        { variety: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [listings, total] = await Promise.all([
      prisma.cropListing.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { farmer: { select: { id: true, name: true, phone: true } } },
      }),
      prisma.cropListing.count({ where }),
    ]);

    const pagination = buildPaginationMeta(total, page, limit);
    return { listings, pagination };
  }

  /**
   * Get a single crop listing by ID.
   * @param {string} listingId
   */
  async getListingById(listingId) {
    const listing = await prisma.cropListing.findUnique({
      where: { id: listingId },
      include: {
        farmer: { select: { id: true, name: true, phone: true, district: true, state: true } },
        reviews: { include: { reviewer: { select: { id: true, name: true } } } },
      },
    });

    if (!listing) {
      throw new NotFoundError(MESSAGES.CROP_NOT_FOUND);
    }

    return listing;
  }

  /**
   * Update a crop listing.
   * @param {string} listingId
   * @param {string} farmerId – must match the listing's farmer
   * @param {object} data – fields to update
   * @param {Array<Buffer>} [imageBuffers] – new images to add
   */
  async updateCropListing(listingId, farmerId, data, imageBuffers = []) {
    const listing = await prisma.cropListing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      throw new NotFoundError(MESSAGES.CROP_NOT_FOUND);
    }

    if (listing.farmerId !== farmerId) {
      throw new ForbiddenError(MESSAGES.FORBIDDEN);
    }

    // Upload new images if provided
    let images = listing.images;
    if (imageBuffers.length > 0) {
      const newUrls = [];
      for (const buffer of imageBuffers) {
        const result = await uploadToCloudinary(buffer, {
          folder: 'agripulse/crops',
        });
        newUrls.push(result.url);
      }
      images = [...images, ...newUrls];
    }

    const updateData = {};
    const allowedFields = [
      'cropName', 'commodity', 'variety', 'quantity', 'unit',
      'qualityGrade', 'expectedPrice', 'description',
      'farmLatitude', 'farmLongitude', 'district', 'state',
      'availabilityStatus',
    ];

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        if (['quantity', 'expectedPrice', 'farmLatitude', 'farmLongitude'].includes(field)) {
          updateData[field] = parseFloat(data[field]);
        } else {
          updateData[field] = data[field];
        }
      }
    }

    updateData.images = images;

    const updated = await prisma.cropListing.update({
      where: { id: listingId },
      data: updateData,
      include: { farmer: { select: { id: true, name: true, phone: true } } },
    });

    logger.info(`Crop listing updated: ${listingId}`);
    return updated;
  }

  /**
   * Delete a crop listing.
   * @param {string} listingId
   * @param {string} farmerId
   */
  async deleteCropListing(listingId, farmerId) {
    const listing = await prisma.cropListing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      throw new NotFoundError(MESSAGES.CROP_NOT_FOUND);
    }

    if (listing.farmerId !== farmerId) {
      throw new ForbiddenError(MESSAGES.FORBIDDEN);
    }

    await prisma.cropListing.delete({ where: { id: listingId } });

    logger.info(`Crop listing deleted: ${listingId}`);
  }
}

module.exports = new FarmerService();
