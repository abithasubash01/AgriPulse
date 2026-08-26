/**
 * @swagger
 * /marketplace/reviews:
 *   post:
 *     summary: Add a review to a listing
 *     tags: [Marketplace]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [listingId, rating]
 *             properties:
 *               listingId:
 *                 type: string
 *                 format: uuid
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review added
 *
 * /marketplace/transactions:
 *   get:
 *     summary: Get transaction history
 *     tags: [Marketplace]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [buyer, farmer]
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, completed, cancelled]
 *     responses:
 *       200:
 *         description: List of transactions
 *
 * /marketplace/transactions/{id}/status:
 *   put:
 *     summary: Update transaction status
 *     tags: [Marketplace]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [completed, cancelled]
 *     responses:
 *       200:
 *         description: Transaction updated
 */

const express = require('express');
const router = express.Router();

const marketplaceController = require('../controllers/marketplace.controller');
const { authenticate } = require('../middlewares/auth');
const { validate } = require('../middlewares/validation');
const {
  reviewValidation,
  transactionQueryValidation,
} = require('../validations/marketplace.validation');

// Require authentication for all marketplace routes
router.use(authenticate);

router.post('/reviews', validate(reviewValidation), marketplaceController.addReview);
router.get('/transactions', validate(transactionQueryValidation), marketplaceController.getTransactions);
router.put('/transactions/:id/status', marketplaceController.updateTransactionStatus);

module.exports = router;
