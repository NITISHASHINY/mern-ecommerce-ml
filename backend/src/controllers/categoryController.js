const Category = require('../models/Category');
const Product = require('../models/Product');

// Create a new category
const createCategory = async (req, res) => {
  try {
    const { name, description, image, parentId, order, metadata } = req.body;
    
    // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category already exists'
      });
    }
    
    // Generate slug
    const slug = name
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '-');
    
    // If parentId is provided, check if parent exists
    if (parentId) {
      const parent = await Category.findById(parentId);
      if (!parent) {
        return res.status(404).json({
          success: false,
          message: 'Parent category not found'
        });
      }
    }
    
    const category = new Category({
      name,
      slug,
      description,
      image,
      parentId: parentId || null,
      order: order || 0,
      metadata
    });
    
    // Set level based on parent
    if (parentId) {
      const parent = await Category.findById(parentId);
      category.level = parent.level + 1;
    }
    
    await category.save();
    
    res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get all categories (hierarchical)
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ level: 1, order: 1 });
    
    // Build hierarchy
    const categoryMap = {};
    const rootCategories = [];
    
    categories.forEach(category => {
      categoryMap[category._id] = { ...category._doc, children: [] };
    });
    
    categories.forEach(category => {
      if (category.parentId) {
        if (categoryMap[category.parentId]) {
          categoryMap[category.parentId].children.push(categoryMap[category._id]);
        }
      } else {
        rootCategories.push(categoryMap[category._id]);
      }
    });
    
    res.json({
      success: true,
      count: categories.length,
      data: rootCategories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all categories (flat list)
const getCategoriesFlat = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ level: 1, order: 1 });
    
    res.json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single category
const getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    // Get subcategories
    const subcategories = await Category.find({ 
      parentId: category._id,
      isActive: true 
    });
    
    // Get product count in this category
    const productCount = await Product.countDocuments({ 
      category: category.name,
      isActive: true 
    });
    
    res.json({
      success: true,
      data: {
        ...category._doc,
        subcategories,
        productCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update category
const updateCategory = async (req, res) => {
  try {
    const { name, description, image, parentId, order, isActive, metadata } = req.body;
    
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    // Check if new name conflicts with other categories
    if (name && name !== category.name) {
      const existing = await Category.findOne({ name });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Category name already exists'
        });
      }
      // Update slug
      category.slug = name
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, '-');
      category.name = name;
    }
    
    if (description) category.description = description;
    if (image) category.image = image;
    if (order !== undefined) category.order = order;
    if (isActive !== undefined) category.isActive = isActive;
    if (metadata) category.metadata = metadata;
    
    // Update parent if provided
    if (parentId !== undefined) {
      if (parentId) {
        const parent = await Category.findById(parentId);
        if (!parent) {
          return res.status(404).json({
            success: false,
            message: 'Parent category not found'
          });
        }
        category.parentId = parentId;
        category.level = parent.level + 1;
      } else {
        category.parentId = null;
        category.level = 0;
      }
    }
    
    await category.save();
    
    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete category
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    // Check if category has subcategories
    const subcategories = await Category.find({ parentId: category._id });
    if (subcategories.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with subcategories. Delete subcategories first.'
      });
    }
    
    // Check if category has products
    const productCount = await Product.countDocuments({ 
      category: category.name 
    });
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category with ${productCount} products. Reassign products first.`
      });
    }
    
    await Category.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get category tree
const getCategoryTree = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ level: 1, order: 1 });
    
    const buildTree = (parentId = null) => {
      return categories
        .filter(cat => String(cat.parentId) === String(parentId))
        .map(cat => ({
          ...cat._doc,
          children: buildTree(cat._id)
        }));
    };
    
    const tree = buildTree(null);
    
    res.json({
      success: true,
      data: tree
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoriesFlat,
  getCategory,
  updateCategory,
  deleteCategory,
  getCategoryTree
};