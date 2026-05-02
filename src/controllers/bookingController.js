const Booking = require('../models/Booking')
const Vendor = require('../models/Vendor')

const createBooking = async (req, res, next) => {
  try {
    const bookingData = { ...req.body }


        console.log('req.user:', req.user) // ← add this



    if (req.user) {
      bookingData.user = req.user._id
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

    res.status(200).json({ success: true, total, page: Number(page), pages: Math.ceil(total / limit), bookings })
  } catch (error) {
    next(error)
  }
}

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

const vendorUpdateBooking = async (req, res, next) => {
  try {
    const { status, vendorNotes } = req.body
    const vendor = await Vendor.findOne({ user: req.user.id })
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor profile not found' })
    }
    const booking = await Booking.findOne({ _id: req.params.id, assignedVendor: vendor._id })
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found or not assigned to you' })
    }
    if (status) booking.status = status
    if (vendorNotes !== undefined) booking.vendorNotes = vendorNotes
    await booking.save()
    res.status(200).json({ success: true, booking })
  } catch (error) {
    next(error)
  }
}

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