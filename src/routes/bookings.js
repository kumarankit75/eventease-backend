const express = require('express')
const router = express.Router()
const {
  createBooking,
  getAllBookings,
  getVendorBookings,
  getUserBookings,
  getBooking,
  updateBooking,
  vendorUpdateBooking,
  assignVendor,
  deleteBooking,
} = require('../controllers/bookingController')
const { protect, adminOnly, vendorOnly } = require('../middleware/auth')

const optionalAuth = async (req, res, next) => {
  try {
    const jwt = require('jsonwebtoken')
    const User = require('../models/User')
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = await User.findById(decoded.id).select('-password')
    }
  } catch (err) {
    // token invalid — continue without user
  }
  next()
}

router.post('/', optionalAuth, createBooking)
router.get('/', protect, adminOnly, getAllBookings)
router.get('/my-bookings', protect, vendorOnly, getVendorBookings)
router.get('/user-bookings', protect, getUserBookings)
router.get('/:id', protect, getBooking)
router.put('/:id', protect, adminOnly, updateBooking)
router.put('/:id/vendor-update', protect, vendorOnly, vendorUpdateBooking)
router.put('/:id/assign', protect, adminOnly, assignVendor)
router.delete('/:id', protect, adminOnly, deleteBooking)

module.exports = router