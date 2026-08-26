/**
 * @swagger
 * /notifications/alerts:
 *   post:
 *     summary: Create a price alert
 *     tags: [Notifications]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [commodity, targetPrice]
 *             properties:
 *               commodity:
 *                 type: string
 *               targetPrice:
 *                 type: number
 *               market:
 *                 type: string
 *               state:
 *                 type: string
 *     responses:
 *       201:
 *         description: Alert created
 *
 *   get:
 *     summary: Get user's price alerts
 *     tags: [Notifications]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of alerts
 *
 * /notifications/alerts/{id}:
 *   delete:
 *     summary: Delete a price alert
 *     tags: [Notifications]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Alert deleted
 */

const express = require('express');
const router = express.Router();

const notificationController = require('../controllers/notification.controller');
const { authenticate } = require('../middlewares/auth');
const { validate } = require('../middlewares/validation');
const {
  createAlertValidation,
  alertIdValidation,
} = require('../validations/notification.validation');

router.use(authenticate);

router.post('/alerts', validate(createAlertValidation), notificationController.createAlert);
router.get('/alerts', notificationController.getAlerts);
router.delete('/alerts/:id', validate(alertIdValidation), notificationController.deleteAlert);

module.exports = router;
