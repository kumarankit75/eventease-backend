const User = require('../models/User')

// @desc    Get all users (admin)
// @route   GET /api/users
const getAllUsers = async (req, res, next) => {
  try {
    const { role, page = 1, limit = 20 } = req.query

    const query = {}
    if (role) query.role = role

    const total = await User.countDocuments(query)
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))

    res.status(200).json({ success: true, total, users })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single user (admin)
// @route   GET /api/users/:id
const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }
    res.status(200).json({ success: true, user })
  } catch (error) {
    next(error)
  }
}

// @desc    Ban or unban user (admin)
// @route   PUT /api/users/:id/toggle-active
const toggleUserActive = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    // Cannot ban yourself
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot ban yourself' })
    }

    user.isActive = !user.isActive
    await user.save()

    res.status(200).json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete user (admin)
// @route   DELETE /api/users/:id
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot delete yourself' })
    }
    await user.deleteOne()
    res.status(200).json({ success: true, message: 'User deleted' })
  } catch (error) {
    next(error)
  }
}

module.exports = { getAllUsers, getUser, toggleUserActive, deleteUser }