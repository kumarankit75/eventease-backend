const express = require('express')
const router = express.Router()
const { createBooking, getAllBookings, getBooking, updateBooking, deleteBooking } = require('../controllers/bookingController')
const { protect, adminOnly } = require('../middleware/auth')

router.post('/', createBooking)
router.get('/', protect, adminOnly, getAllBookings)
router.get('/:id', protect, adminOnly, getBooking)
router.put('/:id', protect, adminOnly, updateBooking)
router.delete('/:id', protect, adminOnly, deleteBooking)

module.exports = router