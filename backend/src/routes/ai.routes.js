/**
 * @swagger
 * /ai/disease-detect:
 *   post:
 *     summary: AI Crop Disease Detection (Placeholder)
 *     tags: [AI]
 *     responses:
 *       501:
 *         description: Not Implemented
 *
 * /ai/price-predict:
 *   get:
 *     summary: AI Price Prediction (Placeholder)
 *     tags: [AI]
 *     responses:
 *       501:
 *         description: Not Implemented
 *
 * /ai/voice-assistant:
 *   post:
 *     summary: AI Voice Assistant (Placeholder)
 *     tags: [AI]
 *     responses:
 *       501:
 *         description: Not Implemented
 *
 * /ai/chatbot:
 *   post:
 *     summary: AI Chatbot (Placeholder)
 *     tags: [AI]
 *     responses:
 *       501:
 *         description: Not Implemented
 */

const express = require('express');
const router = express.Router();
const placeholderController = require('../controllers/placeholder.controller');

router.post('/disease-detect', placeholderController.aiDiseaseDetect);
router.get('/price-predict', placeholderController.aiPricePredict);
router.post('/voice-assistant', placeholderController.aiVoiceAssistant);
router.post('/chatbot', placeholderController.aiChatbot);

module.exports = router;
