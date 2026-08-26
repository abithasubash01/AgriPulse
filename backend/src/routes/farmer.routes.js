/**
 * @swagger
 * /farmer/crops:
 *   post:
 *     summary: Create a new crop listing
 *     tags: [Farmer]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [cropName, commodity, quantity, expectedPrice]
 *             properties:
 *               cropName:
 *                 type: string
 *               commodity:
 *                 type: string
 *               variety:
 *                 type: string
 *               quantity:
 *                 type: number
 *               unit:
 *                 type: string
 *               qualityGrade:
 *                 type: string
 *               expectedPrice:
 *                 type: number
 *               description:
 *                 type: string
 *               farmLatitude:
 *                 type: number
 *               farmLongitude:
 *                 type: number
 *               district:
 *                 type: string
 *               state:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Crop listing created
 *
 *   get:
 *     summary: Get all listings for the logged-in farmer
 *     tags: [Farmer]
 *     security:
 *       - BearerAuth: []
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
 *         name: status
 *         schema:
 *           type: string
 *           enum: [available, sold, reserved, expired]
 *     responses:
 *       200:
 *         description: List of crop listings
 *
 * /farmer/crops/{id}:
 *   get:
 *     summary: Get a specific crop listing
 *     tags: [Farmer]
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
 *         description: Crop listing details
 *
 *   put:
 *     summary: Update a crop listing
 *     tags: [Farmer]
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
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               cropName:
 *                 type: string
 *               expectedPrice:
 *                 type: number
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Crop listing updated
 *
 *   delete:
 *     summary: Delete a crop listing
 *     tags: [Farmer]
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
 *         description: Crop listing deleted
 */

const express = require('express');
const router = express.Router();

const farmerController = require('../controllers/farmer.controller');
const { authenticate } = require('../middlewares/auth');
const { authorize } = require('../middlewares/role');
const { validate } = require('../middlewares/validation');
const { uploadMultiple, handleMulterError } = require('../middlewares/upload');
const { ROLES } = require('../constants');
const {
  createCropValidation,
  updateCropValidation,
  cropIdValidation,
} = require('../validations/farmer.validation');

// All farmer routes require authentication and farmer role
router.use(authenticate, authorize(ROLES.FARMER, ROLES.ADMIN));

router.post(
  '/crops',
  uploadMultiple('images', 5),
  handleMulterError,
  validate(createCropValidation),
  farmerController.createCrop
);

router.get(
  '/crops',
  farmerController.getMyListings
);

router.get(
  '/crops/:id',
  validate(cropIdValidation),
  farmerController.getListingById
);

router.put(
  '/crops/:id',
  uploadMultiple('images', 5),
  handleMulterError,
  validate(updateCropValidation),
  farmerController.updateCrop
);

router.delete(
  '/crops/:id',
  validate(cropIdValidation),
  farmerController.deleteCrop
);

module.exports = router;
