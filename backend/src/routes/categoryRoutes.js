const express = require('express');
const router = express.Router();
const {
  createCategory,
  getCategories,
  getCategoriesFlat,
  getCategory,
  updateCategory,
  deleteCategory,
  getCategoryTree
} = require('../controllers/categoryController');

// Routes
router.post('/', createCategory);
router.get('/', getCategories);
router.get('/flat', getCategoriesFlat);
router.get('/tree', getCategoryTree);
router.get('/:id', getCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;