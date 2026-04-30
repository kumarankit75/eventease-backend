const Vendor = require('../models/Vendor')

// @desc    Get all vendors (public)
// @route   GET /api/vendors
const getVendors = async (req, res, next) => {
  try {
    const { service, city, page = 1, limit = 12 } = req.query

    const query = { isActive: true, status: 'approved' }
    if (service) query.service = service
    if (city) query.city = new RegExp(city, 'i')

    const total = await Vendor.countDocuments(query)
    const vendors = await Vendor.find(query)
      .populate('user', 'name email')
      .sort({ rating: -1, reviewCount: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))

    res.status(200).json({ success: true, total, page: Number(page), pages: Math.ceil(total / limit), vendors })
  } catch (error) {
    next(error)
  }
}

// @desc    Get all vendors for admin (includes pending/rejected)
// @route   GET /api/vendors/admin-all
const getAdminVendors = async (req, res, next) => {
  try {
    const { status, service, page = 1, limit = 100 } = req.query

    const query = {}
    if (status) query.status = status
    if (service) query.service = service

    const total = await Vendor.countDocuments(query)
    const vendors = await Vendor.find(query)
      .populate('user', 'name email phone isActive')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))

    res.status(200).json({ success: true, total, vendors })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single vendor (public)
// @route   GET /api/vendors/:id
const getVendor = async (req, res, next) => {
  try {
    const vendor = await Vendor.findById(req.params.id).populate('user', 'name email')
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' })
    }
    res.status(200).json({ success: true, vendor })
  } catch (error) {
    next(error)
  }
}

// @desc    Get own vendor profile
// @route   GET /api/vendors/my-profile
const getMyVendorProfile = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user.id })
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor profile not found' })
    }
    res.status(200).json({ success: true, vendor })
  } catch (error) {
    next(error)
  }
}

// @desc    Create vendor (admin manually)
// @route   POST /api/vendors
const createVendor = async (req, res, next) => {
  try {
    const vendor = await Vendor.create(req.body)
    res.status(201).json({ success: true, vendor })
  } catch (error) {
    next(error)
  }
}

// @desc    Update vendor — admin can update anything
// @route   PUT /api/vendors/:id
const updateVendor = async (req, res, next) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' })
    }
    res.status(200).json({ success: true, vendor })
  } catch (error) {
    next(error)
  }
}

// @desc    Vendor updates own profile
// @route   PUT /api/vendors/my-profile
const updateMyVendorProfile = async (req, res, next) => {
  try {
    // Vendor cannot update status or isVerified
    const { status, isVerified, user, ...allowedUpdates } = req.body

    const vendor = await Vendor.findOneAndUpdate(
      { user: req.user.id },
      allowedUpdates,
      { new: true, runValidators: true }
    )

    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor profile not found' })
    }

    res.status(200).json({ success: true, vendor })
  } catch (error) {
    next(error)
  }
}

// @desc    Approve or reject vendor (admin)
// @route   PUT /api/vendors/:id/approve
const approveVendor = async (req, res, next) => {
  try {
    const { status } = req.body

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be approved or rejected' })
    }

    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      { status, isVerified: status === 'approved' },
      { new: true }
    )

    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' })
    }

    res.status(200).json({ success: true, vendor })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete vendor (admin)
// @route   DELETE /api/vendors/:id
const deleteVendor = async (req, res, next) => {
  try {
    const vendor = await Vendor.findByIdAndDelete(req.params.id)
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' })
    }
    res.status(200).json({ success: true, message: 'Vendor deleted' })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getVendors,
  getAdminVendors,
  getVendor,
  getMyVendorProfile,
  createVendor,
  updateVendor,
  updateMyVendorProfile,
  approveVendor,
  deleteVendor,
}