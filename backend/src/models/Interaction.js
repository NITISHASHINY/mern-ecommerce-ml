const mongoose = require('mongoose');

const interactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['view', 'click', 'add_to_cart', 'remove_from_cart', 'purchase', 'rate', 'wishlist_add', 'wishlist_remove'],
    required: true,
    index: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: function() {
      return this.type === 'rate';
    }
  },
  quantity: {
    type: Number,
    min: 1,
    required: function() {
      return this.type === 'add_to_cart' || this.type === 'purchase';
    }
  },
  price: {
    type: Number,
    required: function() {
      return this.type === 'purchase';
    }
  },
  sessionId: {
    type: String,
    index: true
  },
  context: {
    device: {
      type: String,
      enum: ['mobile', 'tablet', 'desktop', 'unknown'],
      default: 'unknown'
    },
    browser: String,
    os: String,
    location: {
      city: String,
      country: String,
      ipHash: String
    },
    referrer: String,
    utmSource: String,
    utmMedium: String,
    utmCampaign: String
  },
  weight: {
    type: Number,
    default: 1,
    enum: {
      view: 0.5,
      click: 1,
      add_to_cart: 2,
      purchase: 5,
      rate: 3,
      wishlist_add: 1.5
    }
  }
}, {
  timestamps: true
});

// Composite index for user-product interactions
interactionSchema.index({ userId: 1, productId: 1, type: 1, createdAt: -1 });
interactionSchema.index({ createdAt: -1 });

// TTL index to auto-delete old interactions (keep for 1 year)
interactionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 31536000 });

module.exports = mongoose.model('Interaction', interactionSchema);