/**
 * Cron job to fetch Mandi prices every 6 hours.
 */

const cron = require("node-cron");
const mandiService = require("../services/mandi.service");
const logger = require("../utils/logger");

function initMandiCron() {
  // Run at minute 0 past every 6th hour (00:00, 06:00, 12:00, 18:00)
  cron.schedule("0 */6 * * *", async () => {
    logger.info("Running cron job: fetchAndCachePrices");
    await mandiService.fetchAndCachePrices();
  });

  logger.info("Mandi cron job initialized");

  // Fetch immediately when the server starts
  mandiService.fetchAndCachePrices().catch((err) => logger.error(err));
}

module.exports = { initMandiCron };
