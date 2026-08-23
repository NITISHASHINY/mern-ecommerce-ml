const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

// Create review
const createReview = async (req, res) => {
  try {
    const { productId, rating, title, comment, images } = req.body;
    const userId = req.userId;
    const userName = req.user.name;

    // Check if user purchased this product
    const order = await Order.findOne({
      userId: userId,
      'items.productId': productId,
      status: 'delivered',
    });

    const isVerifiedPurchase = !!order;

    // Check if review already exists
    const existingReview = await Review.findOne({ productId, userId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product',
      });
    }

    const review = new Review({
      productId,
      userId,
      userName,
      rating,
      title,
      comment,
      images,
      isVerifiedPurchase,
    });

    await review.save();

    // Update product ratings
    await updateProductRating(productId);

    res.status(201).json({
      success: true,
      data: review,
    });
  } catch (error) {
    console.error('Review error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get reviews for a product
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({ productId, isActive: true })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({ productId, isActive: true });

    // Get rating distribution
    const distribution = await Review.aggregate([
      { $match: { productId: productId, isActive: true } },
      { $group: { _id: '$rating', count: { $sum: 1 } } },
    ]);

    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    distribution.forEach(d => {
      ratingDistribution[d._id] = d.count;
    });

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
        ratingDistribution,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update review helpful count
const markHelpful = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findByIdAndUpdate(
      id,
      { $inc: { helpful: 1 } },
      { new: true }
    );
    res.json({
      success: true,
      data: review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update product rating helper
const updateProductRating = async (productId) => {
  const result = await Review.aggregate([
    { $match: { productId: productId, isActive: true } },
    { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);

  if (result.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      'ratings.average': result[0].avg,
      'ratings.count': result[0].count,
    });
  }
};

module.exports = {
  createReview,
  getProductReviews,
  markHelpful,
};