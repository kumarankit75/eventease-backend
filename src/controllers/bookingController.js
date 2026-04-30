const Booking = require('../models/Booking')

// @desc    Create booking
// @route   POST /api/bookings
const createBooking = async (req, res, next) => {
  try {
    const booking = await Booking.create(req.body)

    res.status(201).json({
      success: true,
      message: 'Booking enquiry submitted successfully!',
      booking,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get all bookings (admin)
// @route   GET /api/bookings
const getAllBookings = async (req, res, next) => {
  try {
    const { status, service, city, page = 1, limit = 10 } = req.query

    const query = {}
    if (status) query.status = status
    if (service) query.service = service
    if (city) query.city = new RegExp(city, 'i')

    const total = await Booking.countDocuments(query)
    const bookings = await Booking.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      bookings,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single booking
// @route   GET /api/bookings/:id
const getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' })
    }
    res.status(200).json({ success: true, booking })
  } catch (error) {
    next(error)
  }
}

// @desc    Update booking status (admin)
// @route   PUT /api/bookings/:id
const updateBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' })
    }
    res.status(200).json({ success: true, booking })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete booking (admin)
// @route   DELETE /api/bookings/:id
const deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id)
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' })
    }
    res.status(200).json({ success: true, message: 'Booking deleted' })
  } catch (error) {
    next(error)
  }
}

module.exports = { createBooking, getAllBookings, getBooking, updateBooking, deleteBooking }