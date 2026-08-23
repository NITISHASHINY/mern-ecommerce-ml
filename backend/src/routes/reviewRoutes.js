const express = require('express');
const router = express.Router();
const {
  createReview,
  getProductReviews,
  markHelpful,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.get('/product/:productId', getProductReviews);
router.post('/', protect, createReview);
router.put('/:id/helpful', markHelpful);

module.exports = router;