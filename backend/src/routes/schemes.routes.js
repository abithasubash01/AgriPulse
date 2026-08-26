/**
 * @swagger
 * /schemes:
 *   get:
 *     summary: Get agricultural government schemes (Placeholder)
 *     tags: [Schemes]
 *     responses:
 *       200:
 *         description: List of schemes
 */

const express = require('express');
const router = express.Router();
const placeholderController = require('../controllers/placeholder.controller');

router.get('/', placeholderController.getSchemes);

module.exports = router;
