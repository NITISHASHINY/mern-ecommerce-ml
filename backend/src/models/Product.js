const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    unique: false,
    sparse: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: true
  },
  compareAtPrice: {
    type: Number,
    default: null
  },
  costPerItem: {
    type: Number,
    default: null
  },
  category: {
    type: String,
    required: true
  },
  subCategory: {
    type: String,
    default: ''
  },
  tags: {
    type: [String],
    default: []
  },
  brand: {
    type: String,
    default: ''
  },
  sku: {
    type: String,
    required: true,
    unique: true
  },
  images: {
    type: [String],
    default: []
  },
  inventory: {
    quantity: {
      type: Number,
      default: 0
    },
    lowStockThreshold: {
      type: Number,
      default: 10
    },
    isInStock: {
      type: Boolean,
      default: true
    },
    trackQuantity: {
      type: Boolean,
      default: true
    }
  },
  ratings: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    },
    distribution: {
      '1': { type: Number, default: 0 },
      '2': { type: Number, default: 0 },
      '3': { type: Number, default: 0 },
      '4': { type: Number, default: 0 },
      '5': { type: Number, default: 0 }
    }
  },
  specifications: {
    type: Map,
    of: String,
    default: {}
  },
  variants: [{
    name: String,
    sku: String,
    price: Number,
    compareAtPrice: Number,
    inventory: Number,
    attributes: Map
  }],
  weight: {
    value: Number,
    unit: { type: String, enum: ['kg', 'g', 'lb', 'oz'], default: 'kg' }
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: { type: String, enum: ['cm', 'in'], default: 'cm' }
  },
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  purchases: {
    type: Number,
    default: 0
  },
  // Seller/Reseller fields
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  isReseller: {
    type: Boolean,
    default: false
  },
  resellerPrice: {
    type: Number,
    default: null
  },
  commission: {
    type: Number,
    default: 0
  },
  imageUrl: {
    type: String,
    default: ''
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true
});

// Generate slug before saving
productSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '-');
  }
  next();
});

// Update isInStock based on quantity
productSchema.pre('save', function(next) {
  if (this.isModified('inventory.quantity')) {
    this.inventory.isInStock = this.inventory.quantity > 0;
  }
  next();
});

// Index for search
productSchema.index({ name: 'text', description: 'text', tags: 'text', category: 'text' });
productSchema.index({ price: 1, category: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ views: -1 });

module.exports = mongoose.model('Product', productSchema);