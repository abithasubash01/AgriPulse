/**
 * Main application router.
 * Combines all feature routes under their respective prefixes.
 */

const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const farmerRoutes = require('./farmer.routes');
const buyerRoutes = require('./buyer.routes');
const mandiRoutes = require('./mandi.routes');
const marketplaceRoutes = require('./marketplace.routes');
const notificationRoutes = require('./notification.routes');
const weatherRoutes = require('./weather.routes');
const schemesRoutes = require('./schemes.routes');
const aiRoutes = require('./ai.routes');

router.use('/auth', authRoutes);
router.use('/farmer', farmerRoutes);
router.use('/buyer', buyerRoutes);
router.use('/mandi', mandiRoutes);
router.use('/marketplace', marketplaceRoutes);
router.use('/notifications', notificationRoutes);
router.use('/weather', weatherRoutes);
router.use('/schemes', schemesRoutes);
router.use('/ai', aiRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'AgriPulse API is running' });
});

module.exports = router;
