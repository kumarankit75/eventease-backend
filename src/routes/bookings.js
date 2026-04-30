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

router.post('/', createBooking)
router.get('/', protect, adminOnly, getAllBookings)
router.get('/my-bookings', protect, vendorOnly, getVendorBookings)
router.get('/user-bookings', protect, getUserBookings)
router.get('/:id', protect, getBooking)
router.put('/:id', protect, adminOnly, updateBooking)
router.put('/:id/vendor-update', protect, vendorOnly, vendorUpdateBooking)
router.put('/:id/assign', protect, adminOnly, assignVendor)
router.delete('/:id', protect, adminOnly, deleteBooking)

module.exports = router