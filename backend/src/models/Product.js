const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  sku: {
    type: String,
    required: true
  },
  inventory: {
    quantity: {
      type: Number,
      default: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Add to productSchema
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
ratings: {
  average: { type: Number, default: 0 },
  count: { type: Number, default: 0 }
},
images: [{
  type: String,
  default: []
}],
imageUrl: {
  type: String,
  default: ''
},


// Remove any pre-save middleware - just export the model
module.exports = mongoose.model('Product', productSchema);