/**
 * @swagger
 * /mandi/live:
 *   get:
 *     summary: Get live or cached mandi prices
 *     tags: [Mandi]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *       - in: query
 *         name: district
 *         schema:
 *           type: string
 *       - in: query
 *         name: commodity
 *         schema:
 *           type: string
 *       - in: query
 *         name: market
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of mandi prices
 *
 * /mandi/nearby:
 *   get:
 *     summary: Find nearby mandis
 *     tags: [Mandi]
 *     parameters:
 *       - in: query
 *         name: latitude
 *         required: true
 *         schema:
 *           type: number
 *       - in: query
 *         name: longitude
 *         required: true
 *         schema:
 *           type: number
 *       - in: query
 *         name: radius
 *         schema:
 *           type: number
 *           description: Search radius in km (default 50)
 *       - in: query
 *         name: commodity
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of nearby mandis with distances
 *
 * /mandi/recommendation:
 *   get:
 *     summary: Get market recommendation based on transport costs
 *     tags: [Mandi]
 *     parameters:
 *       - in: query
 *         name: latitude
 *         required: true
 *         schema:
 *           type: number
 *       - in: query
 *         name: longitude
 *         required: true
 *         schema:
 *           type: number
 *       - in: query
 *         name: commodity
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: quantity
 *         schema:
 *           type: number
 *           description: Quantity in quintals (default 10)
 *     responses:
 *       200:
 *         description: Recommendation analysis
 */

const express = require('express');
const router = express.Router();

const mandiController = require('../controllers/mandi.controller');
const { validate } = require('../middlewares/validation');
const {
  mandiQueryValidation,
  nearbyMandiValidation,
  recommendationValidation,
} = require('../validations/mandi.validation');

// Mandi endpoints are public
router.get('/live', validate(mandiQueryValidation), mandiController.getLivePrices);
router.get('/nearby', validate(nearbyMandiValidation), mandiController.getNearbyMandis);
router.get('/recommendation', validate(recommendationValidation), mandiController.getRecommendation);

module.exports = router;
