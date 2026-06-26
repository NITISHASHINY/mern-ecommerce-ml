const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  getCategories,
  getProductsByCategory,
  getFeaturedProducts,
  getProductStats
} = require('../controllers/productController');

// Search and filter routes (must come before /:id)
router.get('/search', searchProducts);
router.get('/categories', getCategories);
router.get('/featured', getFeaturedProducts);
router.get('/stats', getProductStats);
router.get('/category/:category', getProductsByCategory);

// CRUD routes
router.post('/', createProduct);
router.get('/', getProducts);
router.get('/:id', getProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;