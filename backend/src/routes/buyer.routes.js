/**
 * @swagger
 * /buyer/listings:
 *   get:
 *     summary: Browse available crop listings
 *     tags: [Buyer]
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
 *         name: search
 *         schema:
 *           type: string
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
 *         name: minPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: qualityGrade
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of available crop listings
 *
 * /buyer/bookmarks/{id}:
 *   post:
 *     summary: Bookmark a crop listing
 *     tags: [Buyer]
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
 *       201:
 *         description: Bookmark added
 *   delete:
 *     summary: Remove a bookmark
 *     tags: [Buyer]
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
 *         description: Bookmark removed
 *
 * /buyer/bookmarks:
 *   get:
 *     summary: Get all bookmarks for the logged-in buyer
 *     tags: [Buyer]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of bookmarks
 *
 * /buyer/enquiries:
 *   post:
 *     summary: Send an enquiry to a farmer
 *     tags: [Buyer]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [listingId, message]
 *             properties:
 *               listingId:
 *                 type: string
 *                 format: uuid
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Enquiry sent
 *
 * /buyer/purchases:
 *   post:
 *     summary: Mark a purchase intent
 *     tags: [Buyer]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [listingId, quantity]
 *             properties:
 *               listingId:
 *                 type: string
 *                 format: uuid
 *               quantity:
 *                 type: number
 *     responses:
 *       201:
 *         description: Purchase intent created
 */

const express = require('express');
const router = express.Router();

const buyerController = require('../controllers/buyer.controller');
const { authenticate } = require('../middlewares/auth');
const { authorize } = require('../middlewares/role');
const { validate } = require('../middlewares/validation');
const { ROLES } = require('../constants');
const {
  browseValidation,
  bookmarkValidation,
  enquiryValidation,
  purchaseValidation,
} = require('../validations/buyer.validation');

// Buyer routes require authentication and buyer/admin/farmer role
router.use(authenticate, authorize(ROLES.BUYER, ROLES.ADMIN, ROLES.FARMER));

router.get('/listings', validate(browseValidation), buyerController.browseListings);

router.post('/bookmarks/:id', validate(bookmarkValidation), buyerController.addBookmark);
router.delete('/bookmarks/:id', validate(bookmarkValidation), buyerController.removeBookmark);
router.get('/bookmarks', buyerController.getBookmarks);

router.post('/enquiries', validate(enquiryValidation), buyerController.createEnquiry);
router.post('/purchases', validate(purchaseValidation), buyerController.purchase);

module.exports = router;
