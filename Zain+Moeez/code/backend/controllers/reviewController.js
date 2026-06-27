const Review = require('../models/Review');
const User = require('../models/User');

// ================================
// ADD REVIEW
// POST /api/reviews
// Protected — Buyer only (seller ko review de sakta hai)
// ================================
const addReview = async (req, res) => {
  try {
    const { sellerId, rating, comment } = req.body;

    // Validation
    if (!sellerId || !rating) {
      return res.status(400).json({ message: 'Seller ID and rating are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Seller exist karta hai?
    const seller = await User.findById(sellerId);
    if (!seller || seller.role !== 'seller') {
      return res.status(404).json({ message: 'Seller not found' });
    }

    // Apne aap ko review nahi de sakte
    if (req.user._id.toString() === sellerId) {
      return res.status(400).json({ message: 'You cannot review yourself' });
    }

    // Duplicate review check — ek reviewer ek seller ko ek baar review kar sakta hai
    const existing = await Review.findOne({
      reviewer: req.user._id,
      seller: sellerId,
    });

    if (existing) {
      // Update karo existing review
      existing.rating = rating;
      existing.comment = comment || existing.comment;
      await existing.save();
      return res.status(200).json({
        message: 'Review updated successfully',
        review: existing,
      });
    }

    // Naya review banao
    const review = await Review.create({
      reviewer: req.user._id,
      seller: sellerId,
      rating,
      comment: comment || '',
    });

    await review.populate('reviewer', 'name city');

    res.status(201).json({
      message: 'Review submitted successfully',
      review,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ================================
// GET SELLER REVIEWS
// GET /api/reviews/seller/:sellerId
// Public
// ================================
const getSellerReviews = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const total = await Review.countDocuments({ seller: sellerId });
    const reviews = await Review.find({ seller: sellerId })
      .populate('reviewer', 'name city createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Average rating calculate karo
    const avgResult = await Review.aggregate([
      { $match: { seller: require('mongoose').Types.ObjectId.createFromHexString(sellerId) } },
      { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);

    const avgRating = avgResult.length > 0 ? avgResult[0].avgRating : 0;

    // Rating distribution calculate karo
    const distribution = await Review.aggregate([
      { $match: { seller: require('mongoose').Types.ObjectId.createFromHexString(sellerId) } },
      { $group: { _id: '$rating', count: { $sum: 1 } } },
      { $sort: { _id: -1 } },
    ]);

    const ratingDist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    distribution.forEach(d => { ratingDist[d._id] = d.count; });

    res.status(200).json({
      reviews,
      avgRating: parseFloat(avgRating.toFixed(1)),
      total,
      ratingDistribution: ratingDist,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ================================
// DELETE REVIEW
// DELETE /api/reviews/:id
// Protected — Reviewer ya Admin
// ================================
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Sirf reviewer ya admin delete kar sakta hai
    if (
      review.reviewer.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await review.deleteOne();
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ================================
// CHECK IF USER REVIEWED
// GET /api/reviews/check/:sellerId
// Protected
// ================================
const checkReview = async (req, res) => {
  try {
    const review = await Review.findOne({
      reviewer: req.user._id,
      seller: req.params.sellerId,
    });
    res.status(200).json({ reviewed: !!review, review: review || null });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { addReview, getSellerReviews, deleteReview, checkReview };
