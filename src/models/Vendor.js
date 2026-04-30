const mongoose = require('mongoose')

const VendorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add vendor name'],
    trim: true,
  },
  service: {
    type: String,
    required: [true, 'Please add service type'],
    enum: ['decoration', 'dj-entertainment', 'catering', 'photography', 'makeup-styling', 'venue'],
  },
  city: {
    type: String,
    required: [true, 'Please add city'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add description'],
  },
  price: {
    type: Number,
    required: [true, 'Please add starting price'],
  },
  priceUnit: {
    type: String,
    default: 'per event',
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  features: [String],
  images: [String],
  phone: String,
  email: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true })

module.exports = mongoose.model('Vendor', VendorSchema)