const Booking = require('../models/Booking')
const Vendor = require('../models/Vendor')

// @desc    Create booking (public)
// @route   POST /api/bookings
const createBooking = async (req, res, next) => {
  try {
    const bookingData = { ...req.body }

    // If logged in user, attach their id
    if (req.user) {
      bookingData.user = req.user.id
    }

    const booking = await Booking.create(bookingData)

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
      .populate('user', 'name email phone')
      .populate('assignedVendor', 'name service city')
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

// @desc    Get vendor's assigned bookings
// @route   GET /api/bookings/my-bookings (vendor)
const getVendorBookings = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user.id })
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor profile not found' })
    }

    const bookings = await Booking.find({ assignedVendor: vendor._id })
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })

    res.status(200).json({ success: true, bookings })
  } catch (error) {
    next(error)
  }
}

// @desc    Get customer's own bookings
// @route   GET /api/bookings/user-bookings
const getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('assignedVendor', 'name service city phone email')
      .sort({ createdAt: -1 })

    res.status(200).json({ success: true, bookings })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single booking
// @route   GET /api/bookings/:id
const getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('assignedVendor', 'name service city phone email')

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' })
    }

    res.status(200).json({ success: true, booking })
  } catch (error) {
    next(error)
  }
}

// @desc    Update booking (admin — can update anything)
// @route   PUT /api/bookings/:id
const updateBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('assignedVendor', 'name service city')

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' })
    }

    res.status(200).json({ success: true, booking })
  } catch (error) {
    next(error)
  }
}

// @desc    Vendor updates booking status + notes
// @route   PUT /api/bookings/:id/vendor-update
const vendorUpdateBooking = async (req, res, next) => {
  try {
    const { status, vendorNotes } = req.body

    const vendor = await Vendor.findOne({ user: req.user.id })
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor profile not found' })
    }

    const booking = await Booking.findOne({
      _id: req.params.id,
      assignedVendor: vendor._id,
    })

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found or not assigned to you' })
    }

    // Vendor can only update status and their own notes
    if (status) booking.status = status
    if (vendorNotes !== undefined) booking.vendorNotes = vendorNotes
    await booking.save()

    res.status(200).json({ success: true, booking })
  } catch (error) {
    next(error)
  }
}

// @desc    Assign vendor to booking (admin)
// @route   PUT /api/bookings/:id/assign
const assignVendor = async (req, res, next) => {
  try {
    const { vendorId } = req.body

    const vendor = await Vendor.findById(vendorId)
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' })
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { assignedVendor: vendorId, status: 'contacted' },
      { new: true }
    ).populate('assignedVendor', 'name service city phone email')

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

module.exports = {
  createBooking,
  getAllBookings,
  getVendorBookings,
  getUserBookings,
  getBooking,
  updateBooking,
  vendorUpdateBooking,
  assignVendor,
  deleteBooking,
}