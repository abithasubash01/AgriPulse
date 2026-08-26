/**
 * @swagger
 * /weather/{location}:
 *   get:
 *     summary: Get weather information (Placeholder)
 *     tags: [Weather]
 *     parameters:
 *       - in: path
 *         name: location
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Weather data
 */

const express = require('express');
const router = express.Router();
const placeholderController = require('../controllers/placeholder.controller');

router.get('/:location', placeholderController.getWeather);

module.exports = router;
