const Product = require('../models/Product');

// Create a new product
const createProduct = async (req, res) => {
  try {
    console.log('Creating product with data:', req.body);
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true });
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single product
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Search and filter products
const searchProducts = async (req, res) => {
  try {
    const {
      keyword,
      category,
      minPrice,
      maxPrice,
      minRating,
      sortBy,
      sortOrder,
      page = 1,
      limit = 10
    } = req.query;

    // Build filter object
    const filter = { isActive: true };

    // Keyword search (name, description, category)
    if (keyword) {
      filter.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
    }

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Price range filter
    if (minPrice !== undefined) {
      filter.price = { ...filter.price, $gte: parseFloat(minPrice) };
    }
    if (maxPrice !== undefined) {
      filter.price = { ...filter.price, $lte: parseFloat(maxPrice) };
    }

    // Rating filter
    if (minRating) {
      filter['ratings.average'] = { $gte: parseFloat(minRating) };
    }

    // Build sort object
    let sort = {};
    if (sortBy) {
      const order = sortOrder === 'desc' ? -1 : 1;
      switch (sortBy) {
        case 'price':
          sort = { price: order };
          break;
        case 'rating':
          sort = { 'ratings.average': order };
          break;
        case 'name':
          sort = { name: order };
          break;
        case 'createdAt':
          sort = { createdAt: order };
          break;
        default:
          sort = { createdAt: -1 };
      }
    } else {
      sort = { createdAt: -1 };
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    // Execute query
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      data: products,
      pagination: {
        page: parseInt(page),
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Search products error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get product categories (for filter dropdown)
const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category', { isActive: true });
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get products by category
const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category, isActive: true });
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get featured products
const getFeaturedProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const products = await Product.find({ isActive: true, isFeatured: true })
      .limit(limit);
    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get product statistics
const getProductStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments({ isActive: true });
    const categories = await Product.distinct('category', { isActive: true });
    const priceStats = await Product.aggregate([
      { $match: { isActive: true } },
      { 
        $group: { 
          _id: null, 
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          avgPrice: { $avg: '$price' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        totalProducts,
        totalCategories: categories.length,
        categories,
        priceRange: priceStats[0] || { minPrice: 0, maxPrice: 0, avgPrice: 0 }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// EXPORT ALL FUNCTIONS AT THE BOTTOM
module.exports = {
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
};