const express = require('express')
const router = express.Router()
const { getAllUsers, getUser, toggleUserActive, deleteUser } = require('../controllers/userController')
const { protect, adminOnly } = require('../middleware/auth')

router.get('/', protect, adminOnly, getAllUsers)
router.get('/:id', protect, adminOnly, getUser)
router.put('/:id/toggle-active', protect, adminOnly, toggleUserActive)
router.delete('/:id', protect, adminOnly, deleteUser)

module.exports = router