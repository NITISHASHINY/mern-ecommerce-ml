const express = require('express');
const router = express.Router();

// Simple test route - no controller
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Order route is working!' });
});

// Simple POST test
router.post('/test-post', (req, res) => {
  res.json({ success: true, message: 'POST works!', body: req.body });
});

// Then the controller routes
const {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  updatePaymentStatus,
  deleteOrder
} = require('../controllers/orderController');

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrder);
router.put('/:id/status', updateOrderStatus);
router.put('/:id/payment', updatePaymentStatus);
router.delete('/:id', deleteOrder);

module.exports = router;