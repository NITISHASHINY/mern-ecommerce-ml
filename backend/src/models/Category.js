const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    lowercase: true
  },
  description: {
    type: String,
    maxlength: 500
  },
  image: {
    type: String
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  level: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  metadata: {
    title: String,
    description: String,
    keywords: [String]
  }
}, {
  timestamps: true
});

// Remove pre-save middleware - generate slug in controller instead
module.exports = mongoose.model('Category', categorySchema);