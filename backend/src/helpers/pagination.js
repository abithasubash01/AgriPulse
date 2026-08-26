/**
 * Pagination helper.
 * Parses page/limit from query params and returns Prisma-compatible skip/take + metadata.
 */

const env = require('../config/env');

/**
 * Parse pagination params from the request query string.
 * @param {object} query – req.query
 * @returns {{ page: number, limit: number, skip: number }}
 */
function parsePagination(query) {
  let page = parseInt(query.page, 10);
  let limit = parseInt(query.limit, 10);

  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(limit) || limit < 1) limit = env.DEFAULT_PAGE_SIZE;
  if (limit > env.MAX_PAGE_SIZE) limit = env.MAX_PAGE_SIZE;

  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

/**
 * Build pagination metadata for the response.
 * @param {number} total – total number of records
 * @param {number} page
 * @param {number} limit
 */
function buildPaginationMeta(total, page, limit) {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

module.exports = { parsePagination, buildPaginationMeta };
