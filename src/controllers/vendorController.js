const Vendor = require('../models/Vendor')

// @desc    Get all vendors
// @route   GET /api/vendors
const getVendors = async (req, res, next) => {
  try {
    const { service, city, page = 1, limit = 12 } = req.query

    const query = { isActive: true }
    if (service) query.service = service
    if (city) query.city = new RegExp(city, 'i')

    const total = await Vendor.countDocuments(query)
    const vendors = await Vendor.find(query)
      .sort({ rating: -1, reviewCount: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      vendors,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single vendor
// @route   GET /api/vendors/:id
const getVendor = async (req, res, next) => {
  try {
    const vendor = await Vendor.findById(req.params.id)
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' })
    }
    res.status(200).json({ success: true, vendor })
  } catch (error) {
    next(error)
  }
}

// @desc    Create vendor (admin)
// @route   POST /api/vendors
const createVendor = async (req, res, next) => {
  try {
    const vendor = await Vendor.create(req.body)
    res.status(201).json({ success: true, vendor })
  } catch (error) {
    next(error)
  }
}

// @desc    Update vendor (admin)
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

module.exports = { getVendors, getVendor, createVendor, updateVendor, deleteVendor }