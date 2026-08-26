/**
 * Mandi Service – fetching, caching, and serving Agmarknet prices.
 */

const MANDI_COORDINATES = {
  Nashik: { latitude: 20.0059, longitude: 73.791 },
  Perambalur: { latitude: 11.2333, longitude: 78.8833 },
  Namakkal: { latitude: 11.2194, longitude: 78.1677 },
  Dharmapuri: { latitude: 12.1211, longitude: 78.1582 },
  Madurai: { latitude: 9.9252, longitude: 78.1198 },
  Krishnagiri: { latitude: 12.5186, longitude: 78.2137 },
  Dindigul: { latitude: 10.3673, longitude: 77.9803 },
  Idukki: { latitude: 9.9189, longitude: 77.1025 },
  Thiruvananthapuram: { latitude: 8.5241, longitude: 76.9366 },
  Dhalai: { latitude: 23.8433, longitude: 91.5859 },
};

const axios = require("axios");
const { prisma } = require("../config/database");
const env = require("../config/env");
const mockData = require("../data/mandiMockData");

const {
  parsePagination,
  buildPaginationMeta,
} = require("../helpers/pagination");

const {
  haversineDistance,
  estimateTransportCost,
  calculateNetProfit,
} = require("../helpers/distance");

const logger = require("../utils/logger");
const { MESSAGES } = require("../constants");
const { NotFoundError } = require("../utils/errors");

class MandiService {
  /**
   * Fetch prices from Agmarknet API and cache them in DB.
   */
  async fetchAndCachePrices() {
    try {
      if (!env.DATA_GOV_API_KEY) {
        logger.warn(
          "DATA_GOV_API_KEY is not set. Mandi service will use mock data.",
        );

        await this._seedMockData();
        return;
      }

      const url = `https://api.data.gov.in/resource/${env.DATA_GOV_MANDI_RESOURCE_ID}?api-key=${env.DATA_GOV_API_KEY}&format=json&limit=500`;

      const response = await axios.get(url);
      const records = response.data.records;

      if (!records || records.length === 0) {
        throw new Error("No records found from Agmarknet API");
      }

      const formattedData = records.map((record) => {
        const location = MANDI_COORDINATES[record.district] || {
          latitude: null,
          longitude: null,
        };

        return {
          state: record.state,
          district: record.district,
          market: record.market,
          commodity: record.commodity,
          variety: record.variety,
          arrivalDate: record.arrival_date,
          minPrice: parseFloat(record.min_price) || 0,
          maxPrice: parseFloat(record.max_price) || 0,
          modalPrice: parseFloat(record.modal_price) || 0,
          fetchedAt: new Date(),
          latitude: location.latitude,
          longitude: location.longitude,
        };
      });

      await prisma.$transaction([
        prisma.mandiPrice.deleteMany({}),
        prisma.mandiPrice.createMany({
          data: formattedData,
        }),
      ]);

      logger.info(`Successfully cached ${formattedData.length} mandi records.`);
    } catch (error) {
      logger.error(`Error fetching Agmarknet data: ${error.message}`);
      await this._seedMockData();
    }
  }

  /**
   * Seed DB with mock data if real API fails or is unconfigured.
   */
  async _seedMockData() {
    const count = await prisma.mandiPrice.count();

    if (count === 0) {
      await prisma.mandiPrice.createMany({
        data: mockData,
      });

      logger.info("Database seeded with mock mandi data as fallback.");
    }
  }

  /**
   * Get live/cached mandi prices with filters.
   */
  async getPrices(queryParams) {
    const { page, limit, skip } = parsePagination(queryParams);

    const where = {};

    if (queryParams.state) {
      where.state = {
        equals: queryParams.state,
        mode: "insensitive",
      };
    }

    if (queryParams.district) {
      where.district = {
        equals: queryParams.district,
        mode: "insensitive",
      };
    }

    if (queryParams.commodity) {
      where.commodity = {
        contains: queryParams.commodity,
        mode: "insensitive",
      };
    }

    if (queryParams.market) {
      where.market = {
        contains: queryParams.market,
        mode: "insensitive",
      };
    }

    if (queryParams.search) {
      const searchStr = queryParams.search.trim();
      where.OR = [
        { state: { contains: searchStr, mode: "insensitive" } },
        { district: { contains: searchStr, mode: "insensitive" } },
        { market: { contains: searchStr, mode: "insensitive" } },
        { commodity: { contains: searchStr, mode: "insensitive" } },
        { variety: { contains: searchStr, mode: "insensitive" } },
      ];
    }

    const [prices, total] = await Promise.all([
      prisma.mandiPrice.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          modalPrice: "desc",
        },
      }),

      prisma.mandiPrice.count({
        where,
      }),
    ]);

    const pagination = buildPaginationMeta(total, page, limit);

    if (total === 0 && Object.keys(where).length === 0) {
      return {
        prices: mockData,
        pagination: buildPaginationMeta(mockData.length, 1, limit),
        source: MESSAGES.MANDI_PRICES_MOCK,
      };
    }

    return {
      prices,
      pagination,
      source: MESSAGES.MANDI_PRICES_CACHED,
    };
  }

  /**
   * Find nearby mandis using Haversine distance.
   *
   * Returns only one record per market + commodity.
   * If multiple records exist, the highest modal price is used.
   */
  async getNearbyMandis({ latitude, longitude, radius = 50, commodity }) {
    const allMandis = await prisma.mandiPrice.findMany({
      where: commodity
        ? {
            commodity: {
              contains: commodity,
              mode: "insensitive",
            },
          }
        : {},
    });

    const nearbyMap = new Map();

    allMandis
      .filter(
        (m) =>
          m.latitude !== null &&
          m.longitude !== null &&
          Number.isFinite(Number(m.latitude)) &&
          Number.isFinite(Number(m.longitude)),
      )
      .forEach((m) => {
        const dist = haversineDistance(
          Number(latitude),
          Number(longitude),
          Number(m.latitude),
          Number(m.longitude),
        );

        const distanceKm = Math.round(dist);

        if (distanceKm <= radius) {
          const key = `${m.market}-${m.commodity}`;

          const existing = nearbyMap.get(key);

          if (
            !existing ||
            Number(m.modalPrice || 0) > Number(existing.modalPrice || 0)
          ) {
            nearbyMap.set(key, {
              ...m,
              distanceKm,
            });
          }
        }
      });

    return [...nearbyMap.values()].sort((a, b) => a.distanceKm - b.distanceKm);
  }

  /**
   * Recommend best market based on transport cost.
   */
  /**
   * Recommend best market based on transport cost.
   */
  async getRecommendation({ latitude, longitude, commodity, quantity = 10 }) {
    const nearby = await this.getNearbyMandis({
      latitude,
      longitude,
      radius: 200,
      commodity,
    });

    if (nearby.length === 0) {
      throw new NotFoundError(
        `No markets found for ${commodity} within 200km.`,
      );
    }

    /**
     * Calculate transport cost and net profit
     * for every nearby market.
     */
    const analysis = nearby.map((m) => {
      const transportCost = estimateTransportCost(m.distanceKm, quantity);

      const netProfit = calculateNetProfit(
        m.modalPrice,
        quantity,
        transportCost,
      );

      return {
        market: m.market,
        district: m.district,
        state: m.state,
        distanceKm: m.distanceKm,
        modalPrice: m.modalPrice,
        transportCost,
        netProfit,
      };
    });

    /**
     * Highest net profit = best market.
     */
    const best = [...analysis].sort((a, b) => b.netProfit - a.netProfit)[0];

    /**
     * Shortest distance = nearest market.
     */
    const nearest = [...analysis].sort(
      (a, b) => a.distanceKm - b.distanceKm,
    )[0];

    let recommendationMsg = `Selling in ${best.market} gives the best return.`;

    if (best.market !== nearest.market) {
      const diff = best.netProfit - nearest.netProfit;

      recommendationMsg = `Selling in ${best.market} earns ₹${diff} more than your nearest market (${nearest.market}).`;
    }

    return {
      recommendation: recommendationMsg,
      bestMarket: best,
      analysis,
    };
  }
}

module.exports = new MandiService();
