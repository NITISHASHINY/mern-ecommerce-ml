const express = require('express');
const router = express.Router();
const { becomeSeller, getSellerDashboard } = require('../controllers/sellerController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', protect, becomeSeller);
router.get('/dashboard', protect, getSellerDashboard);

module.exports = router;