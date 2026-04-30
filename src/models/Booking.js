const mongoose = require('mongoose')

const BookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add your name'],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Please add phone number'],
  },
  email: {
    type: String,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email'],
  },
  service: {
    type: String,
    required: [true, 'Please select a service'],
    enum: ['Decoration', 'DJ & Entertainment', 'Catering', 'Photography & Video', 'Makeup & Styling', 'Venue Booking', 'Full Event Package'],
  },
  eventType: {
    type: String,
    required: [true, 'Please select event type'],
    enum: ['Wedding', 'Birthday', 'Corporate', 'Graduation', 'Engagement', 'Baby Shower', 'Festival / Pooja', 'Other'],
  },
  eventDate: {
    type: Date,
  },
  city: {
    type: String,
    required: [true, 'Please add city'],
  },
  details: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['pending', 'contacted', 'confirmed', 'cancelled'],
    default: 'pending',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
  },
}, { timestamps: true })

module.exports = mongoose.model('Booking', BookingSchema)