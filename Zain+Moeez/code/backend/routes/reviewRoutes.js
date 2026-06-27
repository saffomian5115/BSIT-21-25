const express = require('express');
const router = express.Router();
const {
  addReview,
  getSellerReviews,
  deleteReview,
  checkReview,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/reviews — Review add karo (protected)
router.post('/', protect, addReview);

// GET /api/reviews/seller/:sellerId — Seller ke reviews (public)
router.get('/seller/:sellerId', getSellerReviews);

// GET /api/reviews/check/:sellerId — Check if current user reviewed (protected)
router.get('/check/:sellerId', protect, checkReview);

// DELETE /api/reviews/:id — Review delete karo (protected)
router.delete('/:id', protect, deleteReview);

module.exports = router;
