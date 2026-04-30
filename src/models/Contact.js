const mongoose = require('mongoose')

const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add your name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please add email'],
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email'],
  },
  phone: {
    type: String,
    default: '',
  },
  message: {
    type: String,
    required: [true, 'Please add a message'],
  },
  isRead: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true })

module.exports = mongoose.model('Contact', ContactSchema)