const User = require('../models/User')
const Vendor = require('../models/Vendor')

// @desc    Register customer
// @route   POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body

    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email already registered' })
    }

    const user = await User.create({ name, email, phone, password, role: 'user' })
    const token = user.getSignedJwtToken()

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Register vendor
// @route   POST /api/auth/vendor-register
const vendorRegister = async (req, res, next) => {
  try {
    const { name, email, phone, password, service, city, description, price, priceUnit } = req.body

    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email already registered' })
    }

    // Create user with vendor role
    const user = await User.create({ name, email, phone, password, role: 'vendor' })

    // Create vendor profile
    const vendor = await Vendor.create({
      user: user._id,
      name,
      service,
      city,
      description,
      price: Number(price),
      priceUnit: priceUnit || 'per event',
      phone,
      email,
      status: 'pending',
    })

    const token = user.getSignedJwtToken()

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      vendor,
      message: 'Registration successful! Your profile is under review.',
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Login — works for all roles
// @route   POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' })
    }

    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }

    if (!user.isActive) {
      return res.status(401).json({ success: false, message: 'Account has been deactivated' })
    }

    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }

    const token = user.getSignedJwtToken()

    // If vendor, fetch vendor profile too
    let vendorProfile = null
    if (user.role === 'vendor') {
      vendorProfile = await Vendor.findOne({ user: user._id })
    }

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      vendor: vendorProfile,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get current user
// @route   GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
    let vendorProfile = null
    if (user.role === 'vendor') {
      vendorProfile = await Vendor.findOne({ user: user._id })
    }
    res.status(200).json({ success: true, user, vendor: vendorProfile })
  } catch (error) {
    next(error)
  }
}

// @desc    Update profile
// @route   PUT /api/auth/update-profile
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone },
      { new: true, runValidators: true }
    )
    res.status(200).json({ success: true, user })
  } catch (error) {
    next(error)
  }
}

// @desc    Change password
// @route   PUT /api/auth/change-password
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body
    const user = await User.findById(req.user.id).select('+password')
    const isMatch = await user.matchPassword(currentPassword)
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' })
    }
    user.password = newPassword
    await user.save()
    res.status(200).json({ success: true, message: 'Password updated successfully' })
  } catch (error) {
    next(error)
  }
}

module.exports = { register, vendorRegister, login, getMe, updateProfile, changePassword }